<?php
/**
 * Danh mục sản phẩm Ecopillo thêm, sửa, ẩn, xoá ngay trong WooCommerce (Sản phẩm → Danh mục), cả SEO (đợt E 24/11/2026;
 * khách báo: "danh mục sản phẩm chưa thêm được, chưa sửa được, chưa xoá được", "khách muốn thêm SEO vào cho phần danh mục sản phẩm").
 *
 * Khung "Giao diện mới" ở trang thêm / sửa danh mục:
 * - Trang danh mục có sẵn trên web (khung-gia.json `trangDanhMuc`, cùng link với danh mục Woo): tích "dùng tên, mô tả ở đây"
 *   thì web lấy Tên + Mô tả danh mục; tích "Ẩn trang này" thì link chuyển (301) tới trang Ecopillo chọn.
 * - Danh mục khác: tích "Hiện thành trang danh mục" → trang mới ở đúng link danh mục Woo, gồm các sản phẩm trong danh mục
 *   (sản phẩm có sẵn của web, sản phẩm lẻ mới, bộ chăn ga của các mẫu nằm trong đó). Bỏ tích hoặc xoá danh mục: link chuyển 301.
 * - SEO: "Tiêu đề trên Google", "Mô tả trên Google" (để trống thì lấy ở khung Yoast SEO của danh mục, nếu có). Áp cho mọi trang
 *   có cùng link (cả trang bộ sưu tập, trang Khách sạn…).
 * Xoá danh mục có trang trên web: ghi lại link → trang chuyển tới, để link Google đã biết không ra trang lỗi.
 * Ghi vào du-lieu.js: `danhMucWoo` {chu, moi, an} và `seo` (src/data/liveData.ts). Trang có sẵn cần đổi ở máy chủ: trang-wp.php.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_DM_META_BAT', '_eco_dm_bat');
define('ECO_DM_META_DUNG_CHU', '_eco_dm_dung_chu');
define('ECO_DM_META_AN', '_eco_dm_an');
define('ECO_DM_META_CHUYEN', '_eco_dm_chuyen');
define('ECO_DM_META_SEO_TIEU_DE', '_eco_dm_seo_tieu_de');
define('ECO_DM_META_SEO_MO_TA', '_eco_dm_seo_mo_ta');
/** Bài viết SEO chi tiết hiện đầy đủ dưới lưới sản phẩm (27/11/2026) */
define('ECO_DM_META_NOI_DUNG_SEO', '_eco_dm_noi_dung_seo');
/** Link trang danh mục đã xoá trong Woo → trang chuyển tới */
define('ECO_DM_OPT_DA_XOA', 'ecopillo_dm_da_xoa');
/** Link trang danh mục mới đã từng hiện (bỏ hiện thì chuyển 301, không để ra trang cũ của WordPress) */
define('ECO_DM_OPT_DA_HIEN', 'ecopillo_dm_da_hien');
/** Link trang danh mục mới → trang khung (plugin trả) */
define('ECO_DM_OPT_TRANG', 'ecopillo_dm_trang');
/** Link danh mục → tên file JSON bài SEO trong uploads/ecopillo-du-lieu/danh-muc/ */
define('ECO_DM_OPT_BAI_SEO', 'ecopillo_dm_bai_seo');
/** Bản chụp giá trị Yoast danh mục lần chạy đầu: mã danh mục → ô → md5 (như ECO_SY_OPT_GOC của bài / sản phẩm; 27/11/2026) */
define('ECO_DM_OPT_YOAST_GOC', 'ecopillo_dm_yoast_goc');

/** Trang danh mục có sẵn trên web, theo link */
function eco_dm_frame_pages()
{
    $pages = array();
    foreach (isset(eco_gia_frame()['trangDanhMuc']) ? (array) eco_gia_frame()['trangDanhMuc'] : array() as $page) {
        $pages[(string) $page['trang']] = $page;
    }
    return $pages;
}

/** Trang Sản phẩm: nơi chuyển tới mặc định */
function eco_dm_default_target()
{
    $frame = eco_gia_frame();
    return isset($frame['trangSanPham']) && eco_tw_is_path($frame['trangSanPham']) ? (string) $frame['trangSanPham'] : '/';
}

/** Link (phần sau tên miền, có "/" cuối) của một danh mục Woo */
function eco_dm_term_path($term)
{
    $link = get_term_link($term);
    return is_wp_error($link) ? '' : strtolower(trailingslashit((string) parse_url($link, PHP_URL_PATH)));
}

/** Trang chuyển tới khi ẩn / xoá: ô Ecopillo ghi, không hợp lệ thì trang Sản phẩm */
function eco_dm_target_of($term_id, $path)
{
    $target = strtolower(trailingslashit(trim((string) get_term_meta($term_id, ECO_DM_META_CHUYEN, true))));
    return eco_tw_is_path($target) && $target !== $path ? $target : eco_dm_default_target();
}

/** Tiêu đề, mô tả ở khung Yoast SEO của danh mục (nếu có Yoast), đã thay biến %%…%% */
function eco_dm_yoast($term)
{
    $all = get_option('wpseo_taxonomy_meta');
    $meta = is_array($all) && isset($all['product_cat'][$term->term_id]) ? (array) $all['product_cat'][$term->term_id] : array();
    $out = array();
    foreach (array('tieuDe' => 'wpseo_title', 'moTa' => 'wpseo_desc') as $key => $field) {
        $value = isset($meta[$field]) ? (string) $meta[$field] : '';
        if ($value !== '' && function_exists('wpseo_replace_vars')) {
            $value = (string) wpseo_replace_vars($value, $term);
        }
        $value = trim(preg_replace('/%%[a-z0-9_]+%%/i', '', $value));
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));
        if ($value !== '') {
            $out[$key] = $value;
        }
    }
    // Nâng cao → "Cho phép công cụ tìm kiếm hiển thị … ?" = Không (25/11/2026, seo-yoast.php)
    if (isset($meta['wpseo_noindex']) && $meta['wpseo_noindex'] === 'noindex') {
        $out['anGoogle'] = true;
    }
    return $out;
}

function eco_dm_yoast_sign($value)
{
    return md5(is_bool($value) ? ($value ? '1' : '') : (string) $value);
}

/**
 * Bản chụp giá trị Yoast danh mục lúc cài bản mới (27/11/2026, như eco_sy_compute trong seo-yoast.php):
 * web cũ còn sẵn tiêu đề, mô tả Yoast trên 16 danh mục (kể cả trang Sản phẩm /danh-muc-san-pham/san-pham/),
 * đọc thẳng thì chữ cũ đè lên chữ web mới. Chụp lần đầu để chữ cũ không đè; chỉ ô Ecopillo sửa sau đó (hoặc danh mục tạo mới) mới có tác dụng.
 * Xoá option ECO_DM_OPT_YOAST_GOC = chụp lại.
 */
function eco_dm_yoast_base($terms = null)
{
    $base = get_option(ECO_DM_OPT_YOAST_GOC, null);
    if (is_array($base)) {
        return $base;
    }
    if (!is_array($terms)) {
        $terms = taxonomy_exists('product_cat')
            ? get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 400))
            : array();
        $terms = is_array($terms) ? $terms : array();
    }
    $base = array();
    foreach ($terms as $term) {
        $yoast = eco_dm_yoast($term);
        if ($yoast) {
            $base[(int) $term->term_id] = array_map('eco_dm_yoast_sign', $yoast);
        }
    }
    update_option(ECO_DM_OPT_YOAST_GOC, $base, false);
    return $base;
}

/** Chỉ những ô Yoast của danh mục mà Ecopillo đã sửa sau lần chụp đầu (hoặc danh mục tạo mới) */
function eco_dm_yoast_active($term, $base = null)
{
    $yoast = eco_dm_yoast($term);
    if (!$yoast) {
        return array();
    }
    $base = is_array($base) ? $base : eco_dm_yoast_base();
    $id = (int) $term->term_id;
    $active = array();
    foreach ($yoast as $field => $value) {
        if (!isset($base[$id][$field]) || $base[$id][$field] !== eco_dm_yoast_sign($value)) {
            $active[$field] = $value;
        }
    }
    return $active;
}

/** SEO của một danh mục: ô của plugin, trống thì Yoast đã sửa sau lần chụp đầu. Chữ đã bỏ HTML, đổi chữ chất liệu cũ */
function eco_dm_seo($term, $yoast_base = null)
{
    $yoast = eco_dm_yoast_active($term, $yoast_base);
    $title = eco_sp_text(get_term_meta($term->term_id, ECO_DM_META_SEO_TIEU_DE, true), 200);
    $desc = eco_sp_text(get_term_meta($term->term_id, ECO_DM_META_SEO_MO_TA, true), 400);
    $title = $title !== '' ? $title : (isset($yoast['tieuDe']) ? eco_sp_text($yoast['tieuDe'], 200) : '');
    $desc = $desc !== '' ? $desc : (isset($yoast['moTa']) ? eco_sp_text($yoast['moTa'], 400) : '');
    $seo = array_filter(array('tieuDe' => $title, 'moTa' => $desc), 'strlen');
    if (!empty($yoast['anGoogle'])) {
        $seo['anGoogle'] = true;
    }
    return $seo;
}

/** Sản phẩm, bộ chăn ga của một danh mục mới, theo thứ tự trong Woo. @return array{0: string[], 1: string[]} */
function eco_dm_products($term)
{
    $frame = eco_gia_frame();
    $by_woo = array();
    foreach (isset($frame['sanPham']) ? (array) $frame['sanPham'] : array() as $item) {
        foreach ((array) $item['woo'] as $slug) {
            $by_woo[(string) $slug] = (string) $item['khoa'];
        }
    }
    $collections = array();
    foreach (isset($frame['boSuuTap']) ? (array) $frame['boSuuTap'] : array() as $col) {
        $collections[(string) $col['danhMucWoo']] = (string) $col['id'];
    }
    $products = array();
    $sets = array();
    $list = wc_get_products(array('status' => 'publish', 'limit' => 120, 'category' => array($term->slug), 'orderby' => 'menu_order', 'order' => 'ASC'));
    foreach ($list as $product) {
        $slug = $product->get_slug();
        $cats = wp_get_post_terms($product->get_id(), 'product_cat', array('fields' => 'slugs'));
        $in_set = is_array($cats) ? array_values(array_intersect_key($collections, array_flip($cats))) : array();
        if ($in_set) {
            $sets = array_merge($sets, $in_set); // mẫu chăn ga: hiện bộ của mẫu đó
        } elseif (isset($by_woo[$slug])) {
            $products[] = $by_woo[$slug];
        } elseif (preg_match('/^[a-z0-9-]{1,200}$/', $slug)) {
            $products[] = $slug; // sản phẩm lẻ mới (san-pham-moi.php), web bỏ qua tên không biết
        }
    }
    return array(array_values(array_unique($products)), array_values(array_unique($sets)));
}

/** Tên file JSON cho bài SEO của một danh mục (kèm 8 ký tự mã nội dung để trình duyệt nhận bản mới ngay khi sửa) */
function eco_dm_seo_key($path, $html)
{
    $slug = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower(trim((string) $path, '/'))), '-');
    $slug = $slug !== '' ? substr($slug, 0, 100) : 'danh-muc';
    return $slug . '-' . substr(md5((string) $path . "\n" . (string) $html), 0, 8);
}

/** Mô tả đầu trang danh mục: giữ ngắt đoạn nếu Ecopillo viết nhiều đoạn ngắn (1–4 đoạn đầu trang), bỏ HTML và chữ chất liệu cũ */
function eco_dm_description($raw, $max = 1500)
{
    $raw = preg_replace('#<\s*(br|/p|/div|/li|/h[1-6])\b[^>]*>#i', "\n", (string) $raw);
    $raw = str_replace(array("\r\n", "\r"), "\n", (string) $raw);
    $parts = array();
    foreach (preg_split('/\n+/', $raw) as $line) {
        $clean = eco_sp_text($line, $max);
        if ($clean !== '') {
            $parts[] = $clean;
        }
    }
    return mb_substr(implode("\n\n", $parts), 0, $max, 'UTF-8');
}

/**
 * Bài SEO cuối trang danh mục (khách yêu cầu 27/11/2026: bố cục 1. Mô tả → 2. Sản phẩm → 3. Nội dung SEO hiện đầy đủ).
 * Dùng lại bộ lọc thân bài (eco_bv_body): giữ H2/H3/H4, in đậm, danh sách, bảng, ảnh, link; bỏ script/style/iframe, đổi H1→H2,
 * đổi chữ chất liệu cũ thành Lyocell và bỏ ảnh có tên file chứa chữ chất liệu cũ.
 */
function eco_dm_seo_body($raw)
{
    $raw = trim((string) $raw);
    if ($raw === '') {
        return '';
    }
    $raw = mb_substr($raw, 0, 150000, 'UTF-8');
    $html = wpautop($raw);
    if (function_exists('wp_filter_content_tags')) {
        $html = wp_filter_content_tags($html);
    }
    $clean = function_exists('eco_bv_body') ? eco_bv_body($html) : wp_kses_post($html);
    if (trim(wp_strip_all_tags($clean)) === '' && stripos($clean, '<img') === false) {
        return '';
    }
    return $clean;
}

/** Ghi bài SEO danh mục: mỗi danh mục một file JSON riêng để du-lieu.js luôn nhẹ; bài đã xoá thì xoá file cũ */
function eco_dm_write_seo_bodies($bodies)
{
    $dir = eco_gia_dir() . '/danh-muc';
    if (!wp_mkdir_p($dir)) {
        return;
    }
    $keep = array();
    foreach (is_array($bodies) ? $bodies : array() as $key => $html) {
        if (!preg_match('/^[a-z0-9-]{3,160}$/', (string) $key)) {
            continue;
        }
        $name = $key . '.json';
        $keep[$name] = true;
        $file = $dir . '/' . $name;
        if (!is_file($file)) {
            $tmp = $file . '.tmp';
            if (file_put_contents($tmp, wp_json_encode(array('html' => $html))) !== false) {
                rename($tmp, $file);
            }
        }
    }
    foreach ((array) glob($dir . '/*.json') as $file) {
        if (!isset($keep[basename($file)])) {
            @unlink($file);
        }
    }
}

/** Map link danh mục → tên file JSON bài SEO (plugin lưu vào option lúc ghi du-lieu.js) */
function eco_dm_seo_files()
{
    $saved = get_option(ECO_DM_OPT_BAI_SEO, array());
    $out = array();
    foreach (is_array($saved) ? $saved : array() as $path => $key) {
        if (eco_tw_is_path((string) $path) && is_string($key) && preg_match('/^[a-z0-9-]{3,160}$/', $key)) {
            $out[(string) $path] = $key;
        }
    }
    return $out;
}

/** Đọc HTML sạch của bài SEO cuối trang danh mục để máy chủ ghi thẳng vào trang cho Google */
function eco_dm_read_seo_html($path)
{
    $files = eco_dm_seo_files();
    if (!isset($files[$path])) {
        return '';
    }
    $file = eco_gia_dir() . '/danh-muc/' . $files[$path] . '.json';
    if (!is_readable($file)) {
        return '';
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) && isset($data['html']) && is_string($data['html']) ? $data['html'] : '';
}

/**
 * Đọc mọi danh mục Woo. @return array{chu: array, moi: array, an: array, seo: array, rows: array, pages: array, baiSeo: array, baiSeoHtml: array}
 * pages: link trang danh mục mới → trang khung
 */
function eco_dm_compute($fresh = false)
{
    static $result = null;
    if ($result !== null && !$fresh) {
        return $result;
    }
    $result = array('chu' => array(), 'moi' => array(), 'an' => array(), 'seo' => array(), 'rows' => array(), 'pages' => array(), 'baiSeo' => array(), 'baiSeoHtml' => array());
    if (!function_exists('wc_get_products') || !taxonomy_exists('product_cat')) {
        return $result;
    }
    $frame = eco_gia_frame();
    $existing = eco_dm_frame_pages();
    $terms = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 400));
    $terms = is_array($terms) ? $terms : array();
    $yoast_base = eco_dm_yoast_base($terms);
    $current = array();
    $add_seo_body = function ($path, $body) use (&$result) {
        if ($body === '') {
            return;
        }
        $key = eco_dm_seo_key($path, $body);
        $result['baiSeo'][$path] = $key;
        $result['baiSeoHtml'][$key] = $body;
    };
    foreach ($terms as $term) {
        $path = eco_dm_term_path($term);
        if (!eco_tw_is_path($path) || $path === '/') {
            continue;
        }
        $current[$path] = true;
        $seo = eco_dm_seo($term, $yoast_base);
        $seo_body = eco_dm_seo_body(get_term_meta($term->term_id, ECO_DM_META_NOI_DUNG_SEO, true));
        $seo_note = ($seo ? ' · có SEO riêng' : '') . ($seo_body !== '' ? ' · có bài SEO cuối trang' : '');
        if (isset($existing[$path])) {
            $page = $existing[$path];
            if (get_term_meta($term->term_id, ECO_DM_META_AN, true) === '1') {
                $target = eco_dm_target_of($term->term_id, $path);
                $result['an'][$path] = $target;
                $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Đã ẩn, link chuyển tới ' . $target);
                continue;
            }
            if ($seo) {
                $result['seo'][$path] = $seo;
            }
            $add_seo_body($path, $seo_body);
            if (!empty($page['boSuuTap'])) {
                $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Trang bộ sưu tập đang hiện (chữ sửa ở khung bộ sưu tập)' . $seo_note);
                continue;
            }
            $text = '';
            if (get_term_meta($term->term_id, ECO_DM_META_DUNG_CHU, true) === '1') {
                $chu = array_filter(array('ten' => eco_sp_text($term->name, 120), 'moTa' => eco_dm_description($term->description, 1500)), 'strlen');
                if ($chu) {
                    $result['chu'][$path] = $chu;
                    $text = ' · dùng tên, mô tả ở danh mục';
                }
            }
            $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Trang có sẵn đang hiện' . $text . $seo_note);
            continue;
        }
        $on = get_term_meta($term->term_id, ECO_DM_META_BAT, true) === '1';
        $is_set = get_term_meta($term->term_id, '_eco_bst_bat', true) === '1';
        if (!$on || $is_set) {
            if ($is_set) {
                if ($seo) {
                    $result['seo'][$path] = $seo;
                }
                $add_seo_body($path, $seo_body);
                if ($seo || $seo_body !== '') {
                    $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Bộ sưu tập mới' . $seo_note);
                }
            } elseif (eco_tw_static_file($path) !== '' && ($seo || ($seo_body !== '' && $path === eco_dm_default_target()))) {
                if ($seo) {
                    $result['seo'][$path] = $seo;
                }
                if ($path === eco_dm_default_target()) {
                    $add_seo_body($path, $seo_body);
                }
                $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Trang có sẵn' . $seo_note);
            }
            continue;
        }
        $problems = array();
        if (!preg_match('#^/[a-z0-9/-]{3,200}/$#', $path) || preg_match('/tencel|60s/', $path)) {
            $problems[] = 'đường dẫn (slug) chỉ được dùng chữ không dấu, số, gạch nối, và không có chữ chất liệu cũ';
        }
        if (eco_tw_static_file($path) !== '') {
            $problems[] = 'link trùng một trang có sẵn của web';
        }
        $name = eco_sp_text($term->name, 120);
        if ($name === '') {
            $problems[] = 'thiếu tên';
        }
        list($products, $sets) = eco_dm_products($term);
        if (!$products && !$sets) {
            $problems[] = 'chưa có sản phẩm nào đã đăng trong danh mục';
        }
        $result['rows'][] = array(
            'ten' => $term->name, 'id' => $term->term_id, 'trang' => $path,
            'trangThai' => $problems ? 'Trang mới chưa hiện: ' . implode('; ', $problems) : 'Trang mới đang hiện (' . (count($products) + count($sets)) . ' sản phẩm, bộ)' . $seo_note,
        );
        if ($problems) {
            continue;
        }
        if ($seo) {
            $result['seo'][$path] = $seo;
        }
        $add_seo_body($path, $seo_body);
        $result['moi'][] = array(
            'duongDan' => $path, 'woo' => $term->slug, 'ten' => $name, 'moTa' => eco_dm_description($term->description, 1500),
            'sanPham' => $products, 'boSuuTap' => $sets,
        );
        $thumb = (int) get_term_meta($term->term_id, 'thumbnail_id', true);
        $image = $thumb ? eco_sp_image($thumb) : null;
        $result['pages'][$path] = array(
            'khung' => isset($frame['khungDanhMuc']) ? (string) $frame['khungDanhMuc'] : '', 'tieuDe' => $name, 'url' => $path,
            'moTa' => eco_sp_text($term->description, 300), 'anh' => $image ? $image['src'] : '',
        );
    }
    // Trang đã xoá trong Woo, trang mới đã bỏ hiện: chuyển 301 (trừ khi lại có danh mục cùng link)
    $deleted = get_option(ECO_DM_OPT_DA_XOA, array());
    foreach (is_array($deleted) ? $deleted : array() as $path => $target) {
        if (!isset($current[$path]) && eco_tw_is_path($path) && eco_tw_is_path($target)) {
            $result['an'][$path] = $target;
        }
    }
    $shown = get_option(ECO_DM_OPT_DA_HIEN, array());
    foreach (is_array($shown) ? $shown : array() as $path) {
        if (!isset($result['pages'][$path]) && !isset($existing[$path]) && !isset($result['an'][$path]) && eco_tw_is_path($path) && eco_tw_static_file($path) === '') {
            $result['an'][$path] = eco_dm_default_target();
        }
    }
    return $result;
}

/** Sau khi ghi du-lieu.js: nhớ các trang mới đã hiện, lưu trang khung, ghi file JSON bài SEO danh mục */
function eco_dm_after_write($computed)
{
    update_option(ECO_DM_OPT_TRANG, $computed['pages'], false);
    $shown = get_option(ECO_DM_OPT_DA_HIEN, array());
    $shown = array_values(array_unique(array_merge(is_array($shown) ? $shown : array(), array_keys($computed['pages']))));
    update_option(ECO_DM_OPT_DA_HIEN, array_slice($shown, -300), false);
    eco_dm_write_seo_bodies(isset($computed['baiSeoHtml']) ? $computed['baiSeoHtml'] : array());
    update_option(ECO_DM_OPT_BAI_SEO, isset($computed['baiSeo']) ? $computed['baiSeo'] : array(), false);
}

/* ---------------------------------------------------------------- Khung "Giao diện mới" ở trang thêm / sửa danh mục */

/** Các ô của khung, dùng chung cho trang thêm (bảng div) và trang sửa (bảng tr) */
function eco_dm_box_fields($term)
{
    $id = $term ? $term->term_id : 0;
    $path = $term ? eco_dm_term_path($term) : '';
    $existing = eco_dm_frame_pages();
    $page = $path !== '' && isset($existing[$path]) ? $existing[$path] : null;
    $meta = function ($key) use ($id) {
        return $id ? (string) get_term_meta($id, $key, true) : '';
    };
    $fields = array();
    if ($page && empty($page['boSuuTap'])) {
        $fields[] = array('Trang trên web', '<a href="' . esc_url(home_url($path)) . '" target="_blank" rel="noopener">' . esc_html($path) . '</a>'
            . '<p class="description">Đang hiện tên: <strong>' . esc_html($page['ten']) . '</strong>. Mô tả: ' . esc_html($page['moTa']) . '</p>');
        $fields[] = array('Tên, mô tả', '<label><input type="checkbox" name="eco_dm_dung_chu" value="1" ' . checked($meta(ECO_DM_META_DUNG_CHU), '1', false) . '> Giao diện mới dùng Tên và Mô tả ở trang này</label>'
            . '<p class="description">Ô Mô tả phía trên hiện ngay trên lưới sản phẩm (có thể viết 1–4 đoạn ngắn, xuống dòng để tách đoạn). Bỏ tích: web giữ tên, mô tả đang hiện (hoặc bản sửa ở Nội dung web → Chữ từng trang → Đầu trang các danh mục nhỏ).</p>');
        $fields[] = array('Ẩn trang', '<label><input type="checkbox" name="eco_dm_an" value="1" ' . checked($meta(ECO_DM_META_AN), '1', false) . '> Ẩn trang này trên giao diện mới</label>'
            . '<p class="description">Link trang chuyển (301) tới trang ở ô dưới, để link Google đã biết không ra trang lỗi. Xoá danh mục cũng vậy.</p>');
    } elseif ($page) {
        $fields[] = array('Trang trên web', 'Trang bộ sưu tập <a href="' . esc_url(home_url($path)) . '" target="_blank" rel="noopener">' . esc_html($path) . '</a>. Khẩu hiệu, mô tả, câu chuyện: phần "Giao diện mới" phía trên.');
        $fields[] = array('Ẩn bộ', '<label><input type="checkbox" name="eco_dm_an" value="1" ' . checked($meta(ECO_DM_META_AN), '1', false) . '> Ẩn bộ sưu tập này trên giao diện mới</label>'
            . '<p class="description">Bộ và mọi mẫu của bộ rời khỏi web (trang chủ, Sản phẩm, menu, đặt hàng); link trang bộ và trang từng mẫu chuyển (301). Muốn bỏ một mẫu: chuyển sản phẩm mẫu đó sang Bản nháp hoặc Thùng rác.</p>');
    } else {
        $fields[] = array('Trang trên web', '<label><input type="checkbox" name="eco_dm_bat" value="1" ' . checked($meta(ECO_DM_META_BAT), '1', false) . '> Hiện thành trang danh mục trên giao diện mới</label>'
            . '<p class="description">Trang ở đúng link danh mục' . ($path ? ' (<code>' . esc_html($path) . '</code>)' : '') . ', tiêu đề là Tên, đoạn dưới tiêu đề là Mô tả, gồm các sản phẩm đã đăng trong danh mục (thứ tự theo "Thứ tự menu" của sản phẩm). '
            . 'Đường dẫn (slug) không dấu. Bỏ tích hoặc xoá danh mục: link chuyển (301) tới trang ở ô dưới.</p>');
    }
    $fields[] = array('Chuyển tới khi ẩn / xoá', '<input type="text" name="eco_dm_chuyen" maxlength="200" placeholder="' . esc_attr(eco_dm_default_target()) . '" value="' . esc_attr($meta(ECO_DM_META_CHUYEN)) . '">'
        . '<p class="description">Phần sau tên miền, ví dụ /danh-muc-san-pham/dem-ecopillo/. Để trống: trang Sản phẩm.</p>');
    $yoast = $term ? eco_dm_yoast_active($term) : array();
    $hint = !empty($yoast['tieuDe']) ? ' Để trống thì dùng ô ở khung Yoast SEO: "' . esc_html($yoast['tieuDe']) . '".' : ' Để trống thì giữ tiêu đề sẵn có (ô Yoast cũ từ web trước không tự đè; chỉ ô Yoast sửa mới có tác dụng).';
    $fields[] = array('Tiêu đề trên Google', '<input type="text" name="eco_dm_seo_tieu_de" maxlength="200" value="' . esc_attr($meta(ECO_DM_META_SEO_TIEU_DE)) . '">'
        . '<p class="description">Thẻ title của trang, nên dưới 60 chữ cái.' . $hint . '</p>');
    $desc_hint = !empty($yoast['moTa']) ? ' Để trống thì dùng mô tả ở khung Yoast SEO đang sửa.' : ' Để trống thì giữ mô tả sẵn có (ô Yoast cũ từ web trước không tự đè; chỉ ô Yoast sửa mới có tác dụng).';
    $fields[] = array('Mô tả trên Google', '<textarea name="eco_dm_seo_mo_ta" rows="3" maxlength="400">' . esc_textarea($meta(ECO_DM_META_SEO_MO_TA)) . '</textarea>'
        . '<p class="description">Nên dưới 160 chữ cái.' . $desc_hint . '</p>');
    return $fields;
}

add_action('product_cat_edit_form_fields', function ($term) {
    wp_nonce_field('eco_dm_luu', 'eco_dm_nonce');
    echo '<tr class="form-field"><th scope="row" colspan="2"><h2 style="margin:16px 0 0">Giao diện mới: trang danh mục, SEO</h2></th></tr>';
    foreach (eco_dm_box_fields($term) as $field) {
        echo '<tr class="form-field"><th scope="row">' . esc_html($field[0]) . '</th><td>' . $field[1] . '</td></tr>'; // ô đã thoát ở eco_dm_box_fields
    }
    $seo_content = (string) get_term_meta($term->term_id, ECO_DM_META_NOI_DUNG_SEO, true);
    echo '<tr class="form-field"><th scope="row"><label for="eco_dm_noi_dung_seo">Nội dung SEO cuối trang danh mục</label></th><td>';
    wp_editor($seo_content, 'eco_dm_noi_dung_seo', array(
        'textarea_name' => 'eco_dm_noi_dung_seo',
        'textarea_rows' => 14,
        'media_buttons' => true,
        'tinymce' => true,
        'quicktags' => true,
    ));
    echo '<p class="description">Bài viết chi tiết hiện đầy đủ ngay dưới lưới sản phẩm của danh mục này để làm SEO (dùng được Tiêu đề 2/3/4, in đậm, danh sách, bảng, chèn ảnh, link nội bộ). Để trống thì trang không hiện khối này. Đổi vị trí hoặc ẩn ở Nội dung web → Giao diện → Bố cục trang danh mục (hoặc Bố cục trang bộ sưu tập). Không dùng chữ chất liệu cũ trong chữ và tên file ảnh.</p>';
    echo '</td></tr>';
}, 30);

add_action('product_cat_add_form_fields', function () {
    wp_nonce_field('eco_dm_luu', 'eco_dm_nonce');
    echo '<h2 style="margin-top:24px">Giao diện mới: trang danh mục, SEO</h2>';
    foreach (eco_dm_box_fields(null) as $field) {
        echo '<div class="form-field"><label>' . esc_html($field[0]) . '</label>' . $field[1] . '</div>'; // ô đã thoát ở eco_dm_box_fields
    }
    echo '<div class="form-field"><label for="eco_dm_noi_dung_seo">Nội dung SEO cuối trang danh mục</label>'
        . '<textarea id="eco_dm_noi_dung_seo" name="eco_dm_noi_dung_seo" rows="5"></textarea>'
        . '<p class="description">Bài SEO hiện đầy đủ ngay dưới sản phẩm. Muốn dùng khung soạn thảo đầy đủ (Tiêu đề 2/3, in đậm, chèn ảnh, bảng…), bấm "Thêm danh mục mới" xong rồi bấm "Sửa" danh mục vừa tạo.</p></div>';
}, 30);

add_action('created_product_cat', 'eco_dm_save');
add_action('edited_product_cat', 'eco_dm_save');
function eco_dm_save($term_id)
{
    if (!isset($_POST['eco_dm_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eco_dm_nonce'])), 'eco_dm_luu')) {
        return;
    }
    if (!current_user_can('manage_product_terms')) {
        return;
    }
    foreach (array('eco_dm_bat' => ECO_DM_META_BAT, 'eco_dm_dung_chu' => ECO_DM_META_DUNG_CHU, 'eco_dm_an' => ECO_DM_META_AN) as $field => $key) {
        if (isset($_POST[$field]) && $_POST[$field] === '1') {
            update_term_meta($term_id, $key, '1');
        } else {
            delete_term_meta($term_id, $key);
        }
    }
    $texts = array(
        'eco_dm_chuyen' => array(ECO_DM_META_CHUYEN, 200, 'sanitize_text_field'),
        'eco_dm_seo_tieu_de' => array(ECO_DM_META_SEO_TIEU_DE, 200, 'sanitize_text_field'),
        'eco_dm_seo_mo_ta' => array(ECO_DM_META_SEO_MO_TA, 400, 'sanitize_textarea_field'),
    );
    foreach ($texts as $field => $spec) {
        if (!isset($_POST[$field])) {
            continue;
        }
        $value = mb_substr(trim(call_user_func($spec[2], wp_unslash($_POST[$field]))), 0, $spec[1], 'UTF-8');
        if ($value === '') {
            delete_term_meta($term_id, $spec[0]);
        } else {
            update_term_meta($term_id, $spec[0], $value);
        }
    }
    if (isset($_POST['eco_dm_noi_dung_seo'])) {
        $raw_seo = mb_substr(trim((string) wp_unslash($_POST['eco_dm_noi_dung_seo'])), 0, 150000, 'UTF-8');
        $safe_seo = $raw_seo === '' ? '' : wp_kses_post($raw_seo);
        if (trim($safe_seo) === '') {
            delete_term_meta($term_id, ECO_DM_META_NOI_DUNG_SEO);
        } else {
            update_term_meta($term_id, ECO_DM_META_NOI_DUNG_SEO, $safe_seo);
        }
    }
    // Lại có danh mục ở link từng xoá: bỏ chuyển hướng cũ
    $term = get_term($term_id, 'product_cat');
    $deleted = get_option(ECO_DM_OPT_DA_XOA, array());
    $path = $term && !is_wp_error($term) ? eco_dm_term_path($term) : '';
    if (is_array($deleted) && $path !== '' && isset($deleted[$path])) {
        unset($deleted[$path]);
        update_option(ECO_DM_OPT_DA_XOA, $deleted, false);
    }
    eco_gia_mark_dirty();
}

/** Xoá danh mục: nếu nó đang là một trang trên web thì nhớ link → trang chuyển tới */
add_action('pre_delete_term', function ($term_id, $taxonomy) {
    if ($taxonomy !== 'product_cat') {
        return;
    }
    $term = get_term($term_id, 'product_cat');
    $path = $term && !is_wp_error($term) ? eco_dm_term_path($term) : '';
    if (!eco_tw_is_path($path) || $path === '/') {
        return;
    }
    $existing = eco_dm_frame_pages();
    $shown = get_option(ECO_DM_OPT_TRANG, array());
    if (isset($existing[$path]) || (is_array($shown) && isset($shown[$path]))) {
        $deleted = get_option(ECO_DM_OPT_DA_XOA, array());
        $deleted = is_array($deleted) ? $deleted : array();
        $deleted[$path] = eco_dm_target_of($term_id, $path);
        update_option(ECO_DM_OPT_DA_XOA, $deleted, false);
    }
}, 10, 2);
add_action('delete_product_cat', 'eco_gia_mark_dirty');

/* ---------------------------------------------------------------- Cột "Giao diện mới" ở danh sách danh mục */

add_filter('manage_edit-product_cat_columns', function ($columns) {
    $columns['eco_dm'] = 'Giao diện mới';
    return $columns;
});
add_filter('manage_product_cat_custom_column', function ($content, $column, $term_id) {
    if ($column !== 'eco_dm') {
        return $content;
    }
    foreach (eco_dm_compute()['rows'] as $row) {
        if ((int) $row['id'] === (int) $term_id) {
            $bad = strpos($row['trangThai'], 'chưa hiện') !== false;
            return '<span style="' . ($bad ? 'color:#b32d2e;font-weight:600' : '') . '">' . esc_html($row['trangThai']) . '</span>';
        }
    }
    return '<span style="color:#777">Không có trang</span>';
}, 10, 3);

/* ---------------------------------------------------------------- Trang khung cho link danh mục mới */

add_action('template_redirect', 'eco_dm_serve', 0);
function eco_dm_serve()
{
    $path = strtolower(trailingslashit((string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH)));
    if (!eco_tw_is_path($path) || !function_exists('eco_mm_visitor_sees_new') || !eco_mm_visitor_sees_new()) {
        return;
    }
    $pages = get_option(ECO_DM_OPT_TRANG, array());
    if (!is_array($pages) || !isset($pages[$path]) || eco_tw_static_file($path) !== '') {
        return;
    }
    $page = $pages[$path];
    $file = eco_tw_static_file((string) $page['khung']);
    $html = $file !== '' ? (string) file_get_contents($file) : '';
    if ($html === '') {
        return;
    }
    $html = eco_mm_shell($html, '', $page);
    $seo = eco_tw_seo_map();
    $item = isset($seo[$path]) ? $seo[$path] : array();
    $noindex = !empty($item['anGoogle']);
    $html = eco_tw_head(
        $html,
        isset($item['tieuDe']) ? $item['tieuDe'] : '',
        isset($item['moTa']) ? $item['moTa'] : (string) $page['moTa'],
        isset($item['anh']) ? $item['anh'] : '',
        $noindex
    );
    if (function_exists('eco_tw_put_category_seo')) {
        $html = eco_tw_put_category_seo($html, $path);
    }
    if (function_exists('eco_tw_put_free_blocks')) {
        $html = eco_tw_put_free_blocks($html, $path, 'danh-muc');
    }
    if ($noindex) {
        header('X-Robots-Tag: noindex');
    }
    echo $html; // trang tĩnh của giao diện mới, các chữ chèn vào đã thoát
    exit;
}

/** Bảng ở trang "Giá trên web" */
function eco_dm_admin_section()
{
    $rows = eco_dm_compute()['rows'];
    $an = eco_dm_compute()['an'];
    ?>
    <h2>Danh mục sản phẩm trên giao diện mới</h2>
    <p>Sửa ở Sản phẩm → Danh mục, khung <strong>"Giao diện mới: trang danh mục, SEO"</strong>: hiện danh mục mới thành trang, dùng tên / mô tả, ẩn trang, tiêu đề và mô tả trên Google, và bài viết <strong>Nội dung SEO cuối trang danh mục</strong>.
        Xoá danh mục đang có trang thì link tự chuyển (301).</p>
    <?php if (!$rows && !$an) : ?>
        <p style="color:#555">Chưa có danh mục nào nối với giao diện mới.</p>
    <?php else : ?>
        <table class="widefat striped" style="margin-bottom:24px"><thead><tr><th>Danh mục</th><th>Link</th><th>Trạng thái</th></tr></thead><tbody>
        <?php foreach ($rows as $r) : ?>
            <tr><td><a href="<?php echo esc_url(get_edit_term_link($r['id'], 'product_cat', 'product')); ?>"><?php echo esc_html($r['ten']); ?></a></td>
                <td><code><?php echo esc_html($r['trang']); ?></code></td>
                <td style="<?php echo strpos($r['trangThai'], 'chưa hiện') !== false ? 'color:#b32d2e;font-weight:600' : ''; ?>"><?php echo esc_html($r['trangThai']); ?></td></tr>
        <?php endforeach; ?>
        <?php foreach ($an as $from => $to) :
            $listed = false;
            foreach ($rows as $r) {
                $listed = $listed || $r['trang'] === $from;
            }
            if ($listed) {
                continue;
            } ?>
            <tr><td style="color:#555">(đã xoá hoặc bỏ hiện)</td><td><code><?php echo esc_html($from); ?></code></td><td>Link chuyển tới <?php echo esc_html($to); ?></td></tr>
        <?php endforeach; ?>
        </tbody></table>
    <?php endif;
}
