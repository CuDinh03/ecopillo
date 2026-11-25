<?php
/**
 * Giá, hết hàng trên web mới lấy từ WooCommerce (owner 18/11/2026: "giao diện là khung, khách cần tự chỉnh dữ liệu";
 * chọn cách A + Woo: docs/ke-hoach-khach-tu-sua-du-lieu.md).
 *
 * - du-lieu/khung-gia.json (sinh lúc build, src/data/priceFrame.ts): mọi ô giá trên web và tên sản phẩm Woo tương ứng.
 * - Mỗi khi Ecopillo lưu sản phẩm Woo, plugin đọc giá từng biến thể, ghép vào ô giá web, ghi
 *   wp-content/uploads/ecopillo-du-lieu/du-lieu.js (`window.__ECO_GIA__ = …`, cùng file với nội dung: eco_dl_write). Trang web nạp file đó trước gói JS (src/data/liveData.ts).
 * - Chỉ ghi giá công khai (đúng thứ khách thấy trên web). Không gửi đi đâu: dữ liệu không rời hosting.
 * - Mặc định TẮT: giá trong Woo đang là giá cũ. Trang "Giá trên web" có nút nhập giá web vào Woo, nhập xong mới bật.
 * - Ô giá web không có biến thể Woo tương ứng (sản phẩm Woo chưa có, cỡ khác tên): Ecopillo điền "giá riêng" ngay ở trang đó.
 *
 * Ghép cỡ: so phần số của tên cỡ ("160*200" ↔ "160x200"); "Free Size" của bộ ga phủ dùng cho cả 1m6 và 1m8;
 * thuộc tính "Bộ sản phẩm" phân biệt ga phủ / ga chun chần; "Độ dày" cho đệm.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_GIA_OPT_BAT', 'ecopillo_gia_woo_bat');
define('ECO_GIA_OPT_SAO_LUU', 'ecopillo_gia_woo_sao_luu');
define('ECO_GIA_OPT_GHI_LUC', 'ecopillo_gia_woo_ghi_luc');
define('ECO_GIA_OPT_RIENG', 'ecopillo_gia_rieng');

function eco_gia_frame()
{
    static $frame = null;
    if ($frame === null) {
        $file = __DIR__ . '/du-lieu/khung-gia.json';
        $data = is_readable($file) ? json_decode((string) file_get_contents($file), true) : null;
        $frame = is_array($data) ? $data : array('mau' => array(), 'sanPham' => array());
    }
    return $frame;
}

function eco_gia_enabled()
{
    return get_option(ECO_GIA_OPT_BAT) === '1';
}

/** Phần số của tên cỡ: "160*200" → "160200", "120×190" → "120190" */
function eco_gia_digits($text)
{
    return preg_replace('/\D+/', '', (string) $text);
}

function eco_gia_key($name)
{
    return sanitize_title(remove_accents(preg_replace('/^pa_/', '', (string) $name)));
}

function eco_gia_find_product($slugs)
{
    foreach ((array) $slugs as $slug) {
        $post = get_page_by_path((string) $slug, OBJECT, 'product');
        if ($post && $post->post_status === 'publish') {
            $product = wc_get_product($post->ID);
            if ($product) {
                return $product;
            }
        }
    }
    return null;
}

/**
 * Các biến thể đang bán của một sản phẩm, thuộc tính đã chuẩn hoá:
 * size (phần số), sizeText, set ('phu' | 'chun' | ''), thick (phần số). Sản phẩm đơn giản = một dòng không thuộc tính.
 */
function eco_gia_variants($product)
{
    $rows = array();
    if (!$product->is_type('variable')) {
        $rows[] = array('obj' => $product, 'size' => '', 'sizeText' => '', 'set' => '', 'thick' => '', 'any' => true);
        return $rows;
    }
    foreach ($product->get_children() as $child_id) {
        $v = wc_get_product($child_id);
        if (!$v || get_post_status($child_id) !== 'publish') {
            continue; // biến thể đã tắt
        }
        $row = array('obj' => $v, 'size' => null, 'sizeText' => '', 'set' => null, 'thick' => null, 'any' => false);
        foreach ($v->get_attributes() as $key => $value) {
            $label = (string) $value;
            if ($label !== '' && taxonomy_exists($key)) {
                $term = get_term_by('slug', $label, $key);
                $label = $term ? $term->name : $label;
            }
            $name = eco_gia_key($key);
            $lower = function_exists('mb_strtolower') ? mb_strtolower(remove_accents($label)) : strtolower(remove_accents($label));
            if (strpos($name, 'kich-thuoc') !== false || strpos($name, 'size') !== false) {
                $row['size'] = $label === '' ? null : (strpos($lower, 'free') !== false ? 'free' : eco_gia_digits($label));
                $row['sizeText'] = $label;
            } elseif (strpos($name, 'bo-san-pham') !== false || strpos($name, 'kieu-ga') !== false) {
                $row['set'] = $label === '' ? null : (strpos($lower, 'chun') !== false ? 'chun' : 'phu');
            } elseif (strpos($name, 'do-day') !== false) {
                $row['thick'] = $label === '' ? null : eco_gia_digits($label);
            }
        }
        $rows[] = $row;
    }
    return $rows;
}

function eco_gia_price_of($obj)
{
    $price = $obj->get_price();
    return ($price === '' || $price === null) ? null : (int) round((float) $price);
}

/** Biến thể cho một ô bộ chăn ga (cỡ web 160x200…, kiểu ga phủ / chun). Ưu tiên khớp đúng cỡ, rồi Free Size */
function eco_gia_match_set($rows, $size_id, $sheet)
{
    $want = eco_gia_digits($size_id);
    $free_ok = in_array($size_id, array('160x200', '180x200'), true);
    $best = null;
    $best_rank = 0;
    foreach ($rows as $r) {
        if ($r['any']) {
            return $sheet === 'phu' ? $r : null; // sản phẩm một giá (chăn hè)
        }
        $set = $r['set'];
        if ($set !== null && $set !== $sheet) {
            continue;
        }
        if ($set === null && $sheet === 'chun') {
            continue; // không có thuộc tính kiểu ga thì đó là giá chính
        }
        $rank = 0;
        if ($r['size'] === $want) {
            $rank = 3;
        } elseif ($r['size'] === 'free' && $free_ok) {
            $rank = 2;
        } elseif ($r['size'] === null) {
            $rank = 1;
        }
        if ($rank > $best_rank) {
            $best = $r;
            $best_rank = $rank;
        }
    }
    return $best;
}

/** Biến thể cho một lựa chọn sản phẩm lẻ: so phần số, đúng hẳn trước, rồi bắt đầu bằng (đệm ghi "160*200*29") nếu chỉ một */
function eco_gia_match_choice($rows, $size_text, $thick_text = null)
{
    $want = eco_gia_digits($size_text);
    $thick = $thick_text === null ? null : eco_gia_digits($thick_text);
    if ($want === '') {
        return count($rows) === 1 ? $rows[0] : null; // lựa chọn không ghi cỡ ("Theo tư vấn"): chỉ khi Woo có đúng một giá
    }
    $exact = array();
    $prefix = array();
    foreach ($rows as $r) {
        if ($r['any']) {
            return null; // sản phẩm một giá nhưng web có nhiều lựa chọn: không đoán
        }
        $size = (string) $r['size'];
        if ($thick !== null && $r['thick'] !== null && $r['thick'] !== $thick) {
            continue;
        }
        if ($thick !== null && $r['thick'] === null) {
            // Độ dày ghi chung trong tên cỡ: "160*200*29"
            if ($size === $want . $thick) {
                $exact[] = $r;
            }
            continue;
        }
        if ($size === $want) {
            $exact[] = $r;
        } elseif ($size !== '' && strpos($size, $want) === 0) {
            $prefix[] = $r;
        }
    }
    if (count($exact) >= 1) {
        return $exact[0];
    }
    return count($prefix) === 1 ? $prefix[0] : null;
}

/**
 * Ghép giá Woo vào mọi ô của khung giá.
 * @return array{live: array, rows: array} live = phần giá của du-lieu.js; rows = bảng đối chiếu cho trang quản trị
 */
function eco_gia_compute()
{
    $frame = eco_gia_frame();
    $own = eco_gia_own_prices();
    $live = array('mau' => array(), 'sanPham' => array());
    $rows = array();
    /*
     * Một ô giá: tìm biến thể Woo; không có thì dùng giá Ecopillo điền ở trang "Giá trên web" (giá riêng).
     * $id là mã ô (loại:khoá:trường:khoá con), dùng cho ô điền giá riêng.
     */
    $cell = function ($id, $item, $label, $web, $match) use (&$rows, $own) {
        $woo = $match ? eco_gia_price_of($match['obj']) : null;
        $own_price = isset($own[$id]) ? (int) $own[$id] : null;
        $value = $woo !== null ? $woo : $own_price;
        if ($match) {
            $note = $woo === null ? 'Biến thể chưa có giá' : ($woo === (int) $web ? 'Khớp' : 'Khác');
        } else {
            $note = $own_price !== null ? 'Giá riêng' : 'Chưa ghép được';
        }
        $rows[] = array(
            'id' => $id, 'ten' => $item['ten'], 'o' => $label, 'web' => $web, 'woo' => $woo, 'rieng' => $own_price,
            'variation' => $match ? $match['obj']->get_id() : 0, 'coSanPham' => !empty($item['__product']), 'ghiChu' => $note,
        );
        return $value;
    };

    foreach ($frame['mau'] as $item) {
        $product = eco_gia_find_product($item['woo']);
        $item['__product'] = (bool) $product;
        $vars = $product ? eco_gia_variants($product) : array();
        $entry = array('gia' => array(), 'giaChun' => array(), 'het' => array());
        foreach ($item['gia'] as $size => $web) {
            $m = $product ? eco_gia_match_set($vars, $size, 'phu') : null;
            $value = $cell('mau:' . $item['khoa'] . ':gia:' . $size, $item, isset($item['nhanCo'][$size]) ? $item['nhanCo'][$size] : $size, $web, $m);
            if ($value !== null) {
                $entry['gia'][$size] = $value;
            }
            if ($m && !$m['obj']->is_in_stock()) {
                $entry['het'][] = $size;
            }
        }
        if (is_array($item['giaChun'])) {
            foreach ($item['giaChun'] as $size => $web) {
                $m = $product ? eco_gia_match_set($vars, $size, 'chun') : null;
                $label = 'Ga chun chần ' . (isset($item['nhanCo'][$size]) ? $item['nhanCo'][$size] : $size);
                $value = $cell('mau:' . $item['khoa'] . ':giaChun:' . $size, $item, $label, $web, $m);
                if ($value !== null) {
                    $entry['giaChun'][$size] = $value;
                }
            }
        }
        // Có sản phẩm Woo thì luôn ghi "het" (kể cả rỗng) để Woo báo còn hàng trở lại thì web bỏ chữ hết hàng.
        // Không có sản phẩm Woo thì không ghi "het": web giữ hết hàng ghi sẵn trong code
        $entry_out = array_filter(array('gia' => $entry['gia'], 'giaChun' => $entry['giaChun']));
        if ($product) {
            $entry_out['het'] = $entry['het'];
        }
        if ($entry_out) {
            $live['mau'][$item['khoa']] = $entry_out;
        }
    }

    foreach ($frame['sanPham'] as $item) {
        $product = eco_gia_find_product($item['woo']);
        $item['__product'] = (bool) $product;
        $vars = $product ? eco_gia_variants($product) : array();
        $entry = array();
        $base = 'sp:' . $item['khoa'];
        if (is_array($item['chon'])) {
            foreach ($item['chon'] as $choice) {
                $m = $product ? eco_gia_match_choice($vars, $choice['id']) : null;
                $value = $cell($base . ':chon:' . $choice['id'], $item, $choice['nhan'], $choice['gia'], $m);
                if ($value !== null) {
                    $entry['chon'][$choice['id']] = $value;
                }
            }
        } elseif (is_array($item['bienThe'])) {
            foreach ($item['bienThe']['gia'] as $key => $web) {
                list($size, $thick) = array_pad(explode('|', $key, 2), 2, '');
                $m = $product ? eco_gia_match_choice($vars, $size, $thick) : null;
                $value = $cell($base . ':bienThe:' . $key, $item, $size . ' · ' . $thick, $web, $m);
                if ($value !== null) {
                    $entry['bienThe'][$key] = $value;
                }
            }
        } elseif ($item['motGia'] !== null) {
            $m = count($vars) === 1 ? $vars[0] : null;
            $value = $cell($base . ':chon:mac-dinh', $item, 'Một giá', $item['motGia'], $m);
            if ($value !== null) {
                $entry['chon']['mac-dinh'] = $value;
            }
        }
        if ($entry) {
            $live['sanPham'][$item['khoa']] = $entry;
        }
    }
    return array('live' => $live, 'rows' => $rows);
}

/** Giá Ecopillo điền ở trang "Giá trên web" cho ô không có biến thể Woo: mã ô → giá */
function eco_gia_own_prices()
{
    $own = get_option(ECO_GIA_OPT_RIENG, array());
    return is_array($own) ? $own : array();
}

function eco_gia_dir()
{
    $uploads = wp_upload_dir(null, false);
    return trailingslashit($uploads['basedir']) . 'ecopillo-du-lieu';
}

/**
 * Ghi du-lieu.js: giá Woo, mẫu mới, sản phẩm mới (`window.__ECO_GIA__`), nội dung Ecopillo đã sửa (`window.__ECO_NOI_DUNG__`, noi-dung.php),
 * bài viết mới / đã sửa (`window.__ECO_BAI__`, bai-viet-moi.php).
 * Web nạp file này trước gói JS. Ghi qua file tạm rồi đổi tên để khách không đọc file dở.
 */
function eco_dl_write()
{
    $dir = eco_gia_dir();
    if (!wp_mkdir_p($dir)) {
        return false;
    }
    $rules = "# Plugin Ecopillo giao dien moi: file du lieu luon kiem lai, khong luu dem lau\n<IfModule mod_headers.c>\nHeader set Cache-Control \"no-cache\"\n</IfModule>\n";
    if (!is_file($dir . '/.htaccess')) {
        file_put_contents($dir . '/.htaccess', $rules);
    }
    $woo = function_exists('wc_get_product');
    $prices = eco_gia_enabled() && $woo ? eco_gia_compute()['live'] : null;
    // Mẫu mới (mau-moi.php) và sản phẩm lẻ mới (san-pham-moi.php) Ecopillo đăng trong Woo: hiện ngay, không chờ bật lấy giá Woo
    // (giá của chúng vốn chỉ có trong Woo). Chưa bật thì giá sản phẩm có sẵn vẫn để trống, web giữ giá trong code.
    $patterns = $woo ? eco_mm_compute() : array('live' => array(), 'pages' => array());
    $items = $woo && function_exists('eco_sp_compute') ? eco_sp_compute() : array('live' => array(), 'pages' => array());
    // Tên, ảnh, mô tả sản phẩm có sẵn Ecopillo đã soát và tích trong Woo (noi-dung-woo.php): cũng không chờ bật giá
    $content_woo = $woo && function_exists('eco_nw_compute') ? eco_nw_compute()['live'] : array('sanPham' => array(), 'mau' => array());
    $has_content_woo = (array) $content_woo['sanPham'] || (array) $content_woo['mau'];
    // Bộ sưu tập mới, chữ bộ có sẵn Ecopillo tạo / tích ở trang danh mục Woo (bo-suu-tap-moi.php)
    $collections = $woo && function_exists('eco_bst_compute') ? eco_bst_compute() : array('live' => array(), 'chu' => array(), 'pagesBo' => array(), 'pagesMau' => array());
    // Danh mục sản phẩm Ecopillo thêm / sửa / ẩn / xoá, SEO danh mục (danh-muc.php, đợt E)
    $categories = $woo && function_exists('eco_dm_compute') ? eco_dm_compute(true) : array('chu' => array(), 'moi' => array(), 'an' => array(), 'seo' => array(), 'pages' => array());
    $has_categories = $categories['chu'] || $categories['moi'] || $categories['an'] || $categories['seo'];
    // Sản phẩm, mẫu, bộ, bài có sẵn Ecopillo đã gỡ (an-xoa.php, đợt E2)
    $hidden = function_exists('eco_ax_compute') ? eco_ax_compute() : array('sanPham' => array(), 'mau' => array(), 'bo' => array(), 'bai' => array(), 'trang' => array());
    $has_hidden = $hidden['sanPham'] || $hidden['mau'] || $hidden['bo'] || $hidden['bai'];
    // Hết hàng sản phẩm lẻ, mẫu có sẵn (ton-kho.php, đợt F)
    $stock = $woo && function_exists('eco_tk_compute') ? eco_tk_compute() : array('sanPham' => array(), 'mau' => array());
    $has_stock = $stock['sanPham'] || $stock['mau'];
    // SEO Ecopillo điền ở khung Yoast của bài, trang, sản phẩm (seo-yoast.php, 25/11/2026): lưu cho máy chủ, gộp vào `seo` cho web
    $yoast_seo = function_exists('eco_sy_compute') ? eco_sy_compute($woo ? array_merge($items['pages'], $patterns['pages'], $collections['pagesMau']) : array()) : array();
    update_option(ECO_SY_OPT, $yoast_seo, false);
    if ($prices === null && ($yoast_seo || !empty($patterns['thuTu']) || $patterns['live'] || $items['live'] || $has_content_woo || $collections['live'] || $collections['chu'] || $has_categories || $has_hidden || $has_stock)) {
        $prices = array('mau' => new stdClass(), 'sanPham' => new stdClass());
    }
    if ($prices !== null) {
        $prices['mauMoi'] = $patterns['live'];
        // Thứ tự phối màu theo "Thứ tự menu" của sản phẩm mẫu trong Woo (mau-moi.php, 25/11/2026)
        $prices['thuTuMau'] = !empty($patterns['thuTu']) ? $patterns['thuTu'] : new stdClass();
        $prices['sanPhamMoi'] = $items['live'];
        $prices['noiDungWoo'] = $content_woo;
        $prices['boSuuTapMoi'] = $collections['live'];
        $prices['boSuuTapChu'] = $collections['chu'] ? $collections['chu'] : new stdClass();
        $prices['danhMucWoo'] = array(
            'chu' => $categories['chu'] ? $categories['chu'] : new stdClass(),
            'moi' => $categories['moi'],
            'an' => $categories['an'] ? $categories['an'] : new stdClass(),
        );
        // Danh mục và trang bài / sản phẩm khác link nhau; trùng thì danh mục (ô SEO của plugin) đứng trên
        $all_seo = array_merge($yoast_seo, $categories['seo']);
        $prices['seo'] = $all_seo ? $all_seo : new stdClass();
        $prices['tonKho'] = array(
            'sanPham' => $stock['sanPham'] ? $stock['sanPham'] : new stdClass(),
            'mau' => $stock['mau'] ? $stock['mau'] : new stdClass(),
        );
        $prices['an'] = array(
            'sanPham' => $hidden['sanPham'], 'mau' => $hidden['mau'], 'bo' => $hidden['bo'], 'bai' => $hidden['bai'],
            'trang' => $hidden['trang'] ? $hidden['trang'] : new stdClass(),
        );
    }
    if (function_exists('eco_dm_after_write')) {
        eco_dm_after_write($categories);
    }
    update_option(ECO_MM_OPT_TRANG, array_merge($items['pages'], $patterns['pages'], $collections['pagesMau']), false);
    update_option(ECO_BST_OPT_TRANG, $collections['pagesBo'], false);
    // Bài viết mới / đã sửa (bai-viet-moi.php): danh sách vào du-lieu.js, thân bài mỗi bài một file
    $posts = function_exists('eco_bv_compute') ? eco_bv_compute() : array('live' => array(), 'bodies' => array(), 'pages' => array());
    // Trang mới Ecopillo tạo (Trang WordPress có tích "Hiện bằng giao diện mới", trang-moi.php, đợt G): cùng đường đi với bài
    if (function_exists('eco_tm_compute')) {
        $own_pages = eco_tm_compute();
        $posts['live'] = array_merge($posts['live'], $own_pages['live']);
        $posts['bodies'] = array_merge($posts['bodies'], $own_pages['bodies']);
        $posts['pages'] = array_merge($posts['pages'], $own_pages['pages']);
    }
    eco_bv_write_bodies($posts['bodies']);
    update_option(ECO_BV_OPT_TRANG, $posts['pages'], false);
    $content = function_exists('eco_nd_live') ? eco_nd_live() : array();
    $js = '/* Giá và nội dung Ecopillo sửa trong WordPress, plugin ghi lúc ' . gmdate('c') . ". Không sửa tay. */\n"
        . 'window.__ECO_GIA__=' . wp_json_encode($prices) . ";\n"
        . 'window.__ECO_NOI_DUNG__=' . wp_json_encode($content ? $content : null) . ";\n"
        . 'window.__ECO_BAI__=' . wp_json_encode($posts['live'] ? $posts['live'] : null) . ";\n";
    $tmp = $dir . '/du-lieu.js.tmp';
    if (file_put_contents($tmp, $js) === false || !rename($tmp, $dir . '/du-lieu.js')) {
        return false;
    }
    // Màu web (noi-dung.php, src/data/theme.ts): luôn ghi file để trang không gọi phải file không có
    if (function_exists('eco_nd_theme_css')) {
        $css_tmp = $dir . '/mau.css.tmp';
        if (file_put_contents($css_tmp, eco_nd_theme_css()) !== false) {
            rename($css_tmp, $dir . '/mau.css');
        }
    }
    // Trang có sẵn cần WordPress trả (SEO, ẩn, chuyển link): file đánh dấu cho .htaccess (trang-wp.php)
    if (function_exists('eco_tw_sync_markers')) {
        eco_tw_sync_markers();
        eco_tw_write_sitemap();
        eco_tw_write_files();
    }
    update_option(ECO_GIA_OPT_GHI_LUC, current_time('mysql'), false);
    return true;
}

/* ---------------------------------------------------------------- Ghi lại khi Ecopillo sửa sản phẩm */

function eco_gia_mark_dirty()
{
    $GLOBALS['eco_gia_dirty'] = true;
}
foreach (array(
    'woocommerce_update_product', 'woocommerce_new_product', 'woocommerce_save_product_variation',
    'woocommerce_update_product_variation', 'woocommerce_product_set_stock_status', 'woocommerce_variation_set_stock_status',
) as $eco_gia_hook) {
    add_action($eco_gia_hook, 'eco_gia_mark_dirty');
}
add_action('trashed_post', 'eco_gia_mark_post');
add_action('untrashed_post', 'eco_gia_mark_post');
function eco_gia_mark_post($post_id)
{
    if (get_post_type($post_id) === 'product') {
        eco_gia_mark_dirty();
    }
}

add_action('shutdown', 'eco_gia_flush');
function eco_gia_flush()
{
    if (!empty($GLOBALS['eco_gia_dirty'])) {
        $GLOBALS['eco_gia_dirty'] = false;
        eco_dl_write();
    }
}

/** Sau khi cài lại plugin (bản dựng mới, khung giá mới): ghi lại file giá ở lần mở trang quản trị kế tiếp */
add_action('admin_init', 'eco_gia_refresh_if_stale');
function eco_gia_refresh_if_stale()
{
    $file = eco_gia_dir() . '/du-lieu.js';
    $stale = !is_file($file) || !is_file(eco_gia_dir() . '/mau.css');
    foreach (array('khung-gia.json', 'noi-dung-goc.json') as $frame) {
        $path = __DIR__ . '/du-lieu/' . $frame;
        if (!$stale && is_file($path) && filemtime($path) > filemtime($file)) {
            $stale = true;
        }
    }
    if ($stale) {
        eco_dl_write();
    }
}

require_once __DIR__ . '/mau-moi.php';
require_once __DIR__ . '/san-pham-moi.php';
require_once __DIR__ . '/noi-dung-woo.php';
require_once __DIR__ . '/bo-suu-tap-moi.php';
require_once __DIR__ . '/danh-muc.php';
require_once __DIR__ . '/an-xoa.php';
require_once __DIR__ . '/ton-kho.php';
require_once __DIR__ . '/trang-moi.php';
require_once __DIR__ . '/bai-viet-moi.php';
require_once __DIR__ . '/seo-yoast.php';
require_once __DIR__ . '/gia-woo-quan-tri.php';
