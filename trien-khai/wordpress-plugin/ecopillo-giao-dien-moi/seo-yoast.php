<?php
/**
 * SEO Ecopillo điền trong khung Yoast SEO của bài viết, trang, sản phẩm Woo (25/11/2026; owner hỏi "khi ecopillo chỉnh sửa như vậy,
 * họ có tự thêm seo cho từng phần được ko ?", rà thấy hai chỗ thiếu, owner "Làm luôn"):
 * - ô "Tiêu đề SEO" (đã thay biến %%…%%): tiêu đề tab / Google của trang trên giao diện mới (trước đây chỉ dùng tên bài);
 * - ô "Mô tả meta" (từ 50 chữ cái): mô tả Google, cả cho trang dựng sẵn (bài lúc dựng, sản phẩm có sẵn) mà trước đây giữ bản lúc dựng;
 * - Nâng cao → "Cho phép công cụ tìm kiếm hiển thị … trong kết quả tìm kiếm?" = Không: trang ẩn khỏi Google (noindex), ra khỏi sitemap.
 * Tính lúc ghi dữ liệu (eco_dl_write, gia-woo.php), lưu vào option ECO_SY_OPT. Hai nơi đọc: du-lieu.js (`seo`, src/data/liveSeo.ts)
 * và eco_tw_seo_map (trang-wp.php) ghi vào HTML trả về. Dòng ở Nội dung web → "SEO từng trang" vẫn đứng trên cùng.
 * Danh mục sản phẩm: Yoast của danh mục đọc ở danh-muc.php (eco_dm_yoast).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_SY_OPT', 'ecopillo_seo_yoast');
/** Bản chụp giá trị Yoast lần chạy đầu: mã bài / sản phẩm → ô → md5 (eco_sy_compute). Xoá option này = chụp lại */
define('ECO_SY_OPT_GOC', 'ecopillo_seo_yoast_goc');
/** Mô tả Yoast ngắn hơn chừng này coi như chưa viết (như tools/lay-bai-viet-wordpress.mjs lúc dựng và tài liệu quản trị mục 5) */
define('ECO_SY_MIN_DESC', 70);

/**
 * Tiêu đề SEO Yoast của một bài / trang / sản phẩm, đã thay biến; rỗng nếu Ecopillo chưa điền riêng.
 * Như lúc dựng (tools/lay-bai-viet-wordpress.mjs, usePageMeta fullTitle): bỏ đuôi "- ECOPILLO…" của Yoast, thêm " · Ecopillo"
 */
function eco_sy_title($post)
{
    $raw = (string) get_post_meta($post->ID, '_yoast_wpseo_title', true);
    if (trim($raw) === '') {
        return '';
    }
    if (function_exists('wpseo_replace_vars')) {
        $raw = (string) wpseo_replace_vars($raw, $post);
    }
    // Biến Yoast không thay được thì bỏ, rồi bỏ dấu ngăn thừa ở hai đầu (" - ", " | ")
    $raw = preg_replace('/%%[a-z0-9_]+%%/i', '', $raw);
    $raw = preg_replace('/\s+/u', ' ', $raw);
    $raw = preg_replace('/\s*[-–|·]\s*ECOPILLO.*$/iu', '', (string) $raw);
    $raw = preg_replace('/^[\s\-–—|·•]+|[\s\-–—|·•]+$/u', '', (string) $raw);
    $title = eco_sp_text((string) $raw, 180);
    return $title !== '' ? $title . ' · Ecopillo' : '';
}

/** SEO Yoast của một bài / trang / sản phẩm. @return array{tieuDe?: string, moTa?: string, anGoogle?: bool} */
function eco_sy_item($post)
{
    $item = array();
    $title = eco_sy_title($post);
    if ($title !== '') {
        $item['tieuDe'] = $title;
    }
    $desc = eco_sp_text(get_post_meta($post->ID, '_yoast_wpseo_metadesc', true), 160);
    if (mb_strlen($desc, 'UTF-8') >= ECO_SY_MIN_DESC) {
        $item['moTa'] = $desc;
    }
    // Yoast ghi '1' = không cho hiện trên kết quả tìm kiếm, '2' = cho hiện, rỗng = theo cài đặt chung (hiện)
    if ((string) get_post_meta($post->ID, '_yoast_wpseo_meta-robots-noindex', true) === '1') {
        $item['anGoogle'] = true;
    }
    return $item;
}

/**
 * SEO Yoast theo link trang giao diện mới, chỉ những ô Ecopillo sửa sau lần chạy đầu.
 * Web cũ còn sẵn tiêu đề, mô tả Yoast trên bài và sản phẩm cũ; trang web mới đã soạn chữ riêng (bài lúc dựng lấy mô tả Yoast lúc đó,
 * sản phẩm dùng chữ trong code). Đọc thẳng thì lúc cài, chữ cũ sẽ đè lên. Nên lần chạy đầu plugin chụp lại giá trị đang có
 * (ECO_SY_OPT_GOC, theo mã bài / sản phẩm, từng ô), từ đó chỉ ô khác bản chụp mới có tác dụng; bài, sản phẩm tạo sau thì mọi ô đều có.
 * Ecopillo trả ô về đúng chữ cũ thì trang về như lúc dựng.
 * @param array $new_pages trang mẫu mới, sản phẩm lẻ mới (tên sản phẩm Woo → trang khung, mau-moi.php / san-pham-moi.php)
 * @return array<string, array{tieuDe?: string, moTa?: string, anGoogle?: bool}>
 */
function eco_sy_compute($new_pages = array())
{
    $found = array(); // mã bài / sản phẩm → array(link, SEO Yoast)
    $frame = eco_gia_frame();
    // Bài viết, trang WordPress tích "Hiện bằng giao diện mới": link /<tên>/ (bài trong code không phải bài WordPress)
    $code = isset($frame['baiTrongCode']) ? array_flip((array) $frame['baiTrongCode']) : array();
    $posts = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 400, 'orderby' => 'date', 'order' => 'DESC'));
    $pages = defined('ECO_TM_META')
        ? get_posts(array('post_type' => 'page', 'post_status' => 'publish', 'numberposts' => 100, 'meta_key' => ECO_TM_META, 'meta_value' => '1'))
        : array();
    foreach (array_merge($posts, $pages) as $post) {
        $slug = (string) $post->post_name;
        // Như eco_bv_compute: tên bài lạ hoặc có chữ chất liệu cũ thì giao diện mới không có link đó
        if (isset($code[$slug]) || !preg_match('/^[a-z0-9-]{3,200}$/', $slug) || preg_match('/tencel|60s/', $slug)) {
            continue;
        }
        $found[$post->ID] = array('/' . $slug . '/', eco_sy_item($post));
    }
    if (function_exists('wc_get_product') && function_exists('eco_gia_find_product')) {
        // Sản phẩm lẻ, mẫu chăn ga có sẵn: link trang web ↔ sản phẩm Woo (khung-gia.json, như giá)
        foreach (array('sanPham', 'mau') as $key) {
            foreach (isset($frame[$key]) ? (array) $frame[$key] : array() as $row) {
                $path = isset($row['duongDan']) ? (string) $row['duongDan'] : '';
                if (!eco_tw_is_path($path) || empty($row['woo'])) {
                    continue;
                }
                $product = eco_gia_find_product((array) $row['woo']);
                if ($product) {
                    $found[$product->get_id()] = array($path, eco_sy_item(get_post($product->get_id())));
                }
            }
        }
        // Mẫu mới, sản phẩm lẻ mới Ecopillo đăng sau lần dựng: link /san-pham/<tên>/ hoặc link ghi sẵn
        foreach ((array) $new_pages as $slug => $page) {
            $path = isset($page['url']) ? (string) $page['url'] : '/san-pham/' . $slug . '/';
            $post = eco_tw_is_path($path) ? get_page_by_path((string) $slug, OBJECT, 'product') : null;
            if ($post && $post->post_status === 'publish') {
                $found[$post->ID] = array($path, eco_sy_item($post));
            }
        }
    }
    $sign = function ($value) {
        return md5(is_bool($value) ? ($value ? '1' : '') : (string) $value);
    };
    $base = get_option(ECO_SY_OPT_GOC, null);
    if (!is_array($base)) {
        // Lần chạy đầu: chụp lại giá trị Yoast đang có
        $base = array();
        foreach ($found as $id => $entry) {
            if ($entry[1]) {
                $base[$id] = array_map($sign, $entry[1]);
            }
        }
        update_option(ECO_SY_OPT_GOC, $base, false);
    }
    $map = array();
    foreach ($found as $id => $entry) {
        $item = array();
        foreach ($entry[1] as $field => $value) {
            if (!isset($base[$id][$field]) || $base[$id][$field] !== $sign($value)) {
                $item[$field] = $value;
            }
        }
        if ($item) {
            $map[$entry[0]] = $item;
        }
    }
    return $map;
}

/** Bản đã lưu lúc ghi dữ liệu (eco_tw_seo_map đọc mỗi lần trả trang, không truy vấn lại) */
function eco_sy_saved()
{
    $map = get_option(ECO_SY_OPT, array());
    return is_array($map) ? $map : array();
}
