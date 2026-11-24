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
/** Link trang danh mục đã xoá trong Woo → trang chuyển tới */
define('ECO_DM_OPT_DA_XOA', 'ecopillo_dm_da_xoa');
/** Link trang danh mục mới đã từng hiện (bỏ hiện thì chuyển 301, không để ra trang cũ của WordPress) */
define('ECO_DM_OPT_DA_HIEN', 'ecopillo_dm_da_hien');
/** Link trang danh mục mới → trang khung (plugin trả) */
define('ECO_DM_OPT_TRANG', 'ecopillo_dm_trang');

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
        $value = trim(preg_replace('/%%[a-z_]+%%/i', '', $value));
        if ($value !== '') {
            $out[$key] = $value;
        }
    }
    return $out;
}

/** SEO của một danh mục: ô của plugin, trống thì Yoast. Chữ đã bỏ HTML, đổi chữ chất liệu cũ */
function eco_dm_seo($term)
{
    $yoast = eco_dm_yoast($term);
    $title = eco_sp_text(get_term_meta($term->term_id, ECO_DM_META_SEO_TIEU_DE, true), 200);
    $desc = eco_sp_text(get_term_meta($term->term_id, ECO_DM_META_SEO_MO_TA, true), 400);
    $title = $title !== '' ? $title : (isset($yoast['tieuDe']) ? eco_sp_text($yoast['tieuDe'], 200) : '');
    $desc = $desc !== '' ? $desc : (isset($yoast['moTa']) ? eco_sp_text($yoast['moTa'], 400) : '');
    return array_filter(array('tieuDe' => $title, 'moTa' => $desc), 'strlen');
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

/**
 * Đọc mọi danh mục Woo. @return array{chu: array, moi: array, an: array, seo: array, rows: array, pages: array}
 * pages: link trang danh mục mới → trang khung
 */
function eco_dm_compute($fresh = false)
{
    static $result = null;
    if ($result !== null && !$fresh) {
        return $result;
    }
    $result = array('chu' => array(), 'moi' => array(), 'an' => array(), 'seo' => array(), 'rows' => array(), 'pages' => array());
    if (!function_exists('wc_get_products') || !taxonomy_exists('product_cat')) {
        return $result;
    }
    $frame = eco_gia_frame();
    $existing = eco_dm_frame_pages();
    $terms = get_terms(array('taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 400));
    $terms = is_array($terms) ? $terms : array();
    $current = array();
    foreach ($terms as $term) {
        $path = eco_dm_term_path($term);
        if (!eco_tw_is_path($path) || $path === '/') {
            continue;
        }
        $current[$path] = true;
        $seo = eco_dm_seo($term);
        if ($seo) {
            $result['seo'][$path] = $seo;
        }
        $seo_note = $seo ? ' · có SEO riêng' : '';
        if (isset($existing[$path])) {
            $page = $existing[$path];
            if (get_term_meta($term->term_id, ECO_DM_META_AN, true) === '1') {
                $target = eco_dm_target_of($term->term_id, $path);
                $result['an'][$path] = $target;
                $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Đã ẩn, link chuyển tới ' . $target);
                continue;
            }
            if (!empty($page['boSuuTap'])) {
                $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trang' => $path, 'trangThai' => 'Trang bộ sưu tập đang hiện (chữ sửa ở khung bộ sưu tập)' . $seo_note);
                continue;
            }
            $text = '';
            if (get_term_meta($term->term_id, ECO_DM_META_DUNG_CHU, true) === '1') {
                $chu = array_filter(array('ten' => eco_sp_text($term->name, 120), 'moTa' => eco_sp_text($term->description, 600)), 'strlen');
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
            if (eco_tw_static_file($path) !== '' && $seo) {
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
        $result['moi'][] = array(
            'duongDan' => $path, 'woo' => $term->slug, 'ten' => $name, 'moTa' => eco_sp_text($term->description, 600),
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

/** Sau khi ghi du-lieu.js: nhớ các trang mới đã hiện, lưu trang khung */
function eco_dm_after_write($computed)
{
    update_option(ECO_DM_OPT_TRANG, $computed['pages'], false);
    $shown = get_option(ECO_DM_OPT_DA_HIEN, array());
    $shown = array_values(array_unique(array_merge(is_array($shown) ? $shown : array(), array_keys($computed['pages']))));
    update_option(ECO_DM_OPT_DA_HIEN, array_slice($shown, -300), false);
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
            . '<p class="description">Bỏ tích: web giữ tên, mô tả đang hiện (hoặc bản sửa ở Nội dung web → Chữ từng trang → Đầu trang các danh mục nhỏ).</p>');
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
    $yoast = $term ? eco_dm_yoast($term) : array();
    $hint = $yoast ? ' Để trống thì dùng ô ở khung Yoast SEO: "' . esc_html(isset($yoast['tieuDe']) ? $yoast['tieuDe'] : '') . '".' : ' Để trống thì giữ tiêu đề sẵn có (hoặc ô ở khung Yoast SEO nếu có).';
    $fields[] = array('Tiêu đề trên Google', '<input type="text" name="eco_dm_seo_tieu_de" maxlength="200" value="' . esc_attr($meta(ECO_DM_META_SEO_TIEU_DE)) . '">'
        . '<p class="description">Thẻ title của trang, nên dưới 60 chữ cái.' . $hint . '</p>');
    $fields[] = array('Mô tả trên Google', '<textarea name="eco_dm_seo_mo_ta" rows="3" maxlength="400">' . esc_textarea($meta(ECO_DM_META_SEO_MO_TA)) . '</textarea>'
        . '<p class="description">Nên dưới 160 chữ cái. Để trống thì dùng mô tả ở khung Yoast SEO (nếu có), không có thì giữ mô tả sẵn có.</p>');
    return $fields;
}

add_action('product_cat_edit_form_fields', function ($term) {
    wp_nonce_field('eco_dm_luu', 'eco_dm_nonce');
    echo '<tr class="form-field"><th scope="row" colspan="2"><h2 style="margin:16px 0 0">Giao diện mới: trang danh mục, SEO</h2></th></tr>';
    foreach (eco_dm_box_fields($term) as $field) {
        echo '<tr class="form-field"><th scope="row">' . esc_html($field[0]) . '</th><td>' . $field[1] . '</td></tr>'; // ô đã thoát ở eco_dm_box_fields
    }
}, 30);

add_action('product_cat_add_form_fields', function () {
    wp_nonce_field('eco_dm_luu', 'eco_dm_nonce');
    echo '<h2 style="margin-top:24px">Giao diện mới: trang danh mục, SEO</h2>';
    foreach (eco_dm_box_fields(null) as $field) {
        echo '<div class="form-field"><label>' . esc_html($field[0]) . '</label>' . $field[1] . '</div>'; // ô đã thoát ở eco_dm_box_fields
    }
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
    $html = eco_tw_head(
        $html,
        isset($item['tieuDe']) ? $item['tieuDe'] : '',
        isset($item['moTa']) ? $item['moTa'] : (string) $page['moTa'],
        isset($item['anh']) ? $item['anh'] : ''
    );
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
    <p>Sửa ở Sản phẩm → Danh mục, khung <strong>"Giao diện mới: trang danh mục, SEO"</strong>: hiện danh mục mới thành trang, dùng tên / mô tả, ẩn trang, tiêu đề và mô tả trên Google.
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
