<?php
/**
 * Sản phẩm lẻ mới Ecopillo đăng trong WooCommerce (giai đoạn 4b, docs/ke-hoach-khach-tu-sua-du-lieu.md).
 * Anh Quang 18/11/2026: "thêm sp mới và bài viết mới là nhiệm vụ của bên anh", "khi anh thêm 1 sp mới nó không hiện ra".
 *
 * Cách Ecopillo thêm: Sản phẩm → Thêm mới; tên; mô tả ngắn (câu giới thiệu), mô tả (các ý chi tiết); ảnh sản phẩm + thư viện ảnh;
 * giá (sản phẩm đơn) hoặc biến thể (Kích thước, Độ dày…); tích một danh mục như Đệm lò xo, Đệm foam, Ruột chăn gối, Chăn hè. Đăng.
 *
 * Plugin tìm sản phẩm đã đăng ở các danh mục đó (khung-gia.json `danhMuc`, từ WOO_CATEGORY_LISTINGS trong src/data/links.ts)
 * mà web chưa biết, ghi `sanPhamMoi` vào du-lieu.js (src/data/liveData.ts, products.ts ghép vào trang danh mục, trang Sản phẩm, menu),
 * và trả trang khung giao diện mới cho link /san-pham/<tên>/ (dùng chung eco_mm_serve trong mau-moi.php).
 * Chữ lấy từ Woo bỏ hết HTML và đổi chữ chất liệu cũ thành Lyocell (CLAUDE.md). Thiếu ảnh, giá thì không hiện và báo ở trang Giá trên web.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Danh mục Woo bộ chăn ga, khách sạn: không bao giờ là sản phẩm lẻ (bộ chăn ga mới đi theo mau-moi.php) */
define('ECO_SP_BO_QUA', 'bo-ga-phu,bo-ga-chun,du-an-khach-san-nha-nghi');

/** Chữ từ Woo: bỏ thẻ, giải mã ký tự, đổi chữ chất liệu cũ thành Lyocell, bỏ chỉ số sợi cũ, gọn khoảng trắng */
function eco_sp_text($html, $max)
{
    $text = html_entity_decode(wp_strip_all_tags((string) $html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/tencel(\s*(™|®))?(\s*60\s*s\b)?/iu', 'Lyocell', $text);
    $text = preg_replace('/\s*\b60\s?s\b/iu', '', $text);
    $text = trim(preg_replace('/[ \t\x{00A0}]+/u', ' ', $text));
    return mb_substr($text, 0, $max, 'UTF-8');
}

/** Ảnh Thư viện WordPress, chữ alt cũng đổi chữ chất liệu cũ */
function eco_sp_image($attachment_id)
{
    $image = eco_mm_image($attachment_id);
    if ($image) {
        $image['alt'] = eco_sp_text($image['alt'], 300);
    }
    return $image;
}

/** Mô tả dài → các ý (mỗi đoạn, mỗi dòng, mỗi mục danh sách một ý) */
function eco_sp_points($html)
{
    $html = preg_replace('#<\s*(br|/p|/li|/h[1-6]|/div|/tr)\b[^>]*>#i', "\n", (string) $html);
    $points = array();
    foreach (preg_split('/\n+/', $html) as $line) {
        $text = eco_sp_text($line, 600);
        if (mb_strlen($text, 'UTF-8') >= 3) {
            $points[] = $text;
        }
        if (count($points) >= 16) {
            break;
        }
    }
    return $points;
}

/** Thuộc tính hiện ra (không dùng làm biến thể): Chất liệu, Bảo hành… → thông số */
function eco_sp_specs($product)
{
    $specs = array();
    foreach ($product->get_attributes() as $attr) {
        if (!is_object($attr) || $attr->get_variation() || !$attr->get_visible()) {
            continue;
        }
        $values = $attr->is_taxonomy()
            ? wc_get_product_terms($product->get_id(), $attr->get_name(), array('fields' => 'names'))
            : $attr->get_options();
        $label = eco_sp_text(wc_attribute_label($attr->get_name(), $product), 60);
        $value = eco_sp_text(implode(', ', array_map('strval', (array) $values)), 200);
        if ($label !== '' && $value !== '') {
            $specs[] = array('nhan' => $label, 'giaTri' => $value);
        }
    }
    return array_slice($specs, 0, 12);
}

/** Tên hiện của một giá trị thuộc tính biến thể (thuộc tính dùng chung lưu slug của term) */
function eco_sp_attr_label($key, $value)
{
    $label = (string) $value;
    if ($label !== '' && taxonomy_exists($key)) {
        $term = get_term_by('slug', $label, $key);
        $label = $term ? $term->name : $label;
    }
    return eco_sp_text($label, 60);
}

/**
 * Giá của sản phẩm: sản phẩm đơn → motGia; biến thể có cả Kích thước và Độ dày → bienThe; còn lại → chon (một chiều).
 * Biến thể hết hàng, tắt, chưa có giá thì bỏ. @return array|null null khi không có giá nào
 */
function eco_sp_prices($product)
{
    if (!$product->is_type('variable')) {
        $price = eco_gia_price_of($product);
        return ($price && $product->is_in_stock()) ? array('motGia' => $price) : null;
    }
    $rows = array();
    $names = array();
    foreach ($product->get_children() as $child_id) {
        $v = wc_get_product($child_id);
        if (!$v || get_post_status($child_id) !== 'publish' || !$v->is_in_stock()) {
            continue;
        }
        $price = eco_gia_price_of($v);
        if (!$price) {
            continue;
        }
        $row = array('gia' => $price, 'co' => '', 'doDay' => '', 'nhan' => array());
        foreach ($v->get_attributes() as $key => $value) {
            $label = eco_sp_attr_label($key, $value);
            if ($label === '') {
                continue;
            }
            $kind = eco_gia_key($key);
            $names[$key] = eco_sp_text(wc_attribute_label($key, $product), 40);
            if (strpos($kind, 'kich-thuoc') !== false || strpos($kind, 'size') !== false) {
                $row['co'] = $label;
            } elseif (strpos($kind, 'do-day') !== false) {
                $row['doDay'] = $label;
            }
            $row['nhan'][] = $label;
        }
        $rows[] = $row;
    }
    if (!$rows) {
        return null;
    }
    $grid = true;
    foreach ($rows as $r) {
        if ($r['co'] === '' || $r['doDay'] === '' || count($r['nhan']) !== 2) {
            $grid = false;
        }
    }
    if ($grid) {
        $sizes = array();
        $thick = array();
        $table = array();
        foreach ($rows as $r) {
            $sizes[$r['co']] = true;
            $thick[$r['doDay']] = true;
            $table[$r['co'] . '|' . $r['doDay']] = $r['gia'];
        }
        return array('bienThe' => array('co' => array_keys($sizes), 'doDay' => array_keys($thick), 'gia' => $table));
    }
    $choices = array();
    $seen = array();
    foreach ($rows as $r) {
        $label = $r['nhan'] ? implode(' · ', $r['nhan']) : 'Mặc định';
        $id = substr(sanitize_title(remove_accents($label)), 0, 70);
        $id = $id === '' ? 'lua-chon' : $id;
        $base = $id;
        for ($n = 2; isset($seen[$id]); $n++) {
            $id = $base . '-' . $n;
        }
        $seen[$id] = true;
        $choices[] = array('id' => $id, 'nhan' => $label, 'gia' => $r['gia']);
    }
    return array('chon' => array_slice($choices, 0, 40), 'nhanChon' => count($names) === 1 ? (string) reset($names) : 'Lựa chọn');
}

/**
 * Sản phẩm lẻ mới và bảng báo. @return array{live: array, rows: array, pages: array}
 * pages: tên link → trang khung (trang một sản phẩm lẻ có sẵn cùng danh mục)
 */
function eco_sp_compute()
{
    $result = array('live' => array(), 'rows' => array(), 'pages' => array());
    $frame = eco_gia_frame();
    $cats = array();
    foreach (isset($frame['danhMuc']) ? (array) $frame['danhMuc'] : array() as $c) {
        if (!empty($c['woo']) && !empty($c['khung'])) {
            $cats[(string) $c['woo']] = $c;
        }
    }
    // Danh mục Ecopillo tạo và tích "Hiện thành trang danh mục" (danh-muc.php, đợt E): sản phẩm lẻ mới đăng ở đó cũng hiện;
    // trang khung của sản phẩm: khung của danh mục có sẵn đầu tiên (mọi trang sản phẩm lẻ cùng bố cục)
    $first = reset($cats);
    if ($first && function_exists('eco_dm_compute')) {
        foreach (eco_dm_compute()['moi'] as $c) {
            if (!isset($cats[$c['woo']])) {
                $cats[$c['woo']] = array('woo' => $c['woo'], 'trang' => $c['duongDan'], 'khung' => $first['khung']);
            }
        }
    }
    if (!$cats || !function_exists('wc_get_products')) {
        return $result;
    }
    $skip = explode(',', ECO_SP_BO_QUA);
    foreach (isset($frame['boSuuTap']) ? (array) $frame['boSuuTap'] : array() as $col) {
        $skip[] = (string) $col['danhMucWoo'];
    }
    $known = eco_mm_known_slugs();
    $products = wc_get_products(array('status' => 'publish', 'limit' => 300, 'category' => array_keys($cats)));
    foreach ($products as $product) {
        $slug = $product->get_slug();
        if (isset($known[$slug])) {
            continue;
        }
        $terms = wp_get_post_terms($product->get_id(), 'product_cat', array('fields' => 'slugs'));
        $terms = is_array($terms) ? $terms : array();
        if (array_intersect($terms, $skip)) {
            continue;
        }
        $mine = array_values(array_intersect($terms, array_keys($cats)));
        $name = eco_sp_text($product->get_name(), 120);
        $problems = array();
        if (!preg_match('/^[a-z0-9-]{3,200}$/', $slug) || preg_match('/tencel|60s/', $slug)) {
            $problems[] = 'đường dẫn (slug) chỉ được dùng chữ không dấu, số, gạch nối, và không có chữ chất liệu cũ';
        }
        if ($name === '') {
            $problems[] = 'thiếu tên';
        }
        $image = eco_sp_image($product->get_image_id());
        if (!$image) {
            $problems[] = 'thiếu ảnh sản phẩm';
        }
        $prices = eco_sp_prices($product);
        if (!$prices) {
            $problems[] = $product->is_type('variable') ? 'chưa có biến thể nào có giá và còn hàng' : 'thiếu giá hoặc đang hết hàng';
        }
        $result['rows'][] = array(
            'ten' => $product->get_name(), 'id' => $product->get_id(), 'danhMuc' => implode(', ', $mine),
            'trangThai' => $problems ? 'Chưa hiện: ' . implode('; ', $problems) : 'Đang hiện trên web',
        );
        if ($problems) {
            continue;
        }
        $gallery = array();
        foreach ($product->get_gallery_image_ids() as $id) {
            $img = eco_sp_image($id);
            if ($img) {
                $gallery[] = $img;
            }
        }
        $result['live'][] = array_merge(array(
            'duongDan' => $slug,
            'ten' => $name,
            'danhMuc' => $mine,
            'anh' => $image,
            'anhPhu' => array_slice($gallery, 0, 12),
            'tomTat' => eco_sp_text($product->get_short_description(), 400),
            'chiTiet' => eco_sp_points($product->get_description()),
            'thongSo' => eco_sp_specs($product),
        ), $prices);
        $result['pages'][$slug] = array('khung' => $cats[$mine[0]]['khung'], 'tieuDe' => $name, 'anh' => $image['src']);
    }
    return $result;
}
