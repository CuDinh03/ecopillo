<?php
/**
 * Hết hàng / còn hàng của sản phẩm lẻ và mẫu chăn ga CÓ SẴN Ecopillo đổi trong WooCommerce (đợt F 24/11/2026; owner: "khách phải
 * 100% tự sửa được tất cả những gì có ở web"). Trước đây chỉ mẫu chăn ga có hết hàng, và chỉ khi đã bật lấy giá Woo.
 *
 * Cách Ecopillo báo hết: trang sửa sản phẩm Woo → Kiểm kê kho → Trạng thái kho "Hết hàng" (sản phẩm đơn), hoặc từng biến thể
 * (kích thước, độ dày) → "Hết hàng". Đổi lại "Còn hàng" là web mở lại.
 * Lấy tình trạng kho khi: đã bật lấy giá Woo (gia-woo.php), HOẶC sản phẩm đó đã được đổi tình trạng kho sau khi cài bản này
 * (ghi lúc đổi). Để tình trạng kho cũ của web WordPress cũ (chưa ai soát) không tự làm sản phẩm trên web mới thành "hết".
 *
 * Ghi vào du-lieu.js `tonKho` {sanPham: {khoá: [lựa chọn hết]}, mau: {"bộ/mã": [cỡ hết]}} (src/data/liveData.ts).
 * Lựa chọn: id lựa chọn (chon), "cỡ|độ dày" (bienThe), "mac-dinh" (sản phẩm một giá).
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Tên link sản phẩm Woo (sản phẩm chính) đã được Ecopillo đổi tình trạng kho → thời điểm */
define('ECO_TK_OPT', 'ecopillo_ton_kho_da_sua');

function eco_tk_touch($id)
{
    $product = function_exists('wc_get_product') ? wc_get_product($id) : null;
    if (!$product) {
        return;
    }
    $parent = $product->get_parent_id() ? wc_get_product($product->get_parent_id()) : $product;
    $slug = $parent ? (string) $parent->get_slug() : '';
    if (!preg_match('/^[a-z0-9-]{1,200}$/', $slug)) {
        return;
    }
    $touched = get_option(ECO_TK_OPT, array());
    $touched = is_array($touched) ? $touched : array();
    $touched[$slug] = time();
    update_option(ECO_TK_OPT, $touched, false);
    eco_gia_mark_dirty();
}
add_action('woocommerce_product_set_stock_status', 'eco_tk_touch', 10, 1);
add_action('woocommerce_variation_set_stock_status', 'eco_tk_touch', 10, 1);

/** Sản phẩm này có lấy tình trạng kho không */
function eco_tk_follows($woo_slugs)
{
    if (eco_gia_enabled()) {
        return true;
    }
    $touched = get_option(ECO_TK_OPT, array());
    return is_array($touched) && (bool) array_intersect_key(array_flip((array) $woo_slugs), $touched);
}

/** @return array{sanPham: array<string, string[]>, mau: array<string, string[]>, rows: array} */
function eco_tk_compute()
{
    $result = array('sanPham' => array(), 'mau' => array(), 'rows' => array());
    if (!function_exists('wc_get_product')) {
        return $result;
    }
    $frame = eco_gia_frame();
    foreach (isset($frame['sanPham']) ? (array) $frame['sanPham'] : array() as $item) {
        if (!eco_tk_follows($item['woo'])) {
            continue;
        }
        $product = eco_gia_find_product($item['woo']);
        if (!$product) {
            continue;
        }
        $all_out = !$product->is_in_stock();
        $vars = eco_gia_variants($product);
        $out = array();
        if (is_array($item['chon'])) {
            foreach ($item['chon'] as $choice) {
                $m = eco_gia_match_choice($vars, $choice['id']);
                if ($all_out || ($m && !$m['obj']->is_in_stock())) {
                    $out[] = (string) $choice['id'];
                }
            }
        } elseif (is_array($item['bienThe'])) {
            foreach (array_keys($item['bienThe']['gia']) as $key) {
                list($size, $thick) = array_pad(explode('|', (string) $key, 2), 2, '');
                $m = eco_gia_match_choice($vars, $size, $thick);
                if ($all_out || ($m && !$m['obj']->is_in_stock())) {
                    $out[] = (string) $key;
                }
            }
        } elseif ($all_out) {
            $out[] = 'mac-dinh';
        }
        if ($out) {
            $result['sanPham'][(string) $item['khoa']] = $out;
            $result['rows'][] = array('ten' => (string) $item['ten'], 'het' => implode(', ', $out));
        }
    }
    foreach (isset($frame['mau']) ? (array) $frame['mau'] : array() as $item) {
        if (!eco_tk_follows($item['woo'])) {
            continue;
        }
        $product = eco_gia_find_product($item['woo']);
        if (!$product) {
            continue;
        }
        $all_out = !$product->is_in_stock();
        $vars = eco_gia_variants($product);
        $out = array();
        foreach (array('160x200', '180x200', '200x220') as $size) {
            $m = eco_gia_match_set($vars, $size, 'phu');
            if ($all_out || ($m && !$m['obj']->is_in_stock())) {
                $out[] = $size;
            }
        }
        if ($out) {
            $result['mau'][(string) $item['khoa']] = $out;
            $result['rows'][] = array('ten' => (string) $item['ten'], 'het' => implode(', ', $out));
        }
    }
    return $result;
}

/** Bảng ở trang "Giá trên web" */
function eco_tk_admin_section()
{
    $rows = eco_tk_compute()['rows'];
    ?>
    <h2>Đang hết hàng trên web</h2>
    <p>Báo hết: trang sửa sản phẩm → Kiểm kê kho → Trạng thái kho "Hết hàng" (hoặc từng biến thể kích thước, độ dày). Đổi lại "Còn hàng" là web mở lại.
        Trên web: lựa chọn hết hàng mờ đi, ghi "Tạm hết hàng", không đặt được; hết cả sản phẩm thì ghi ở cạnh giá.</p>
    <?php if (!$rows) : ?>
        <p style="color:#555">Không có sản phẩm nào đang báo hết.</p>
    <?php else : ?>
        <table class="widefat striped" style="margin-bottom:24px"><thead><tr><th>Sản phẩm / mẫu</th><th>Lựa chọn hết hàng</th></tr></thead><tbody>
        <?php foreach ($rows as $r) : ?>
            <tr><td><?php echo esc_html($r['ten']); ?></td><td><?php echo esc_html($r['het']); ?></td></tr>
        <?php endforeach; ?>
        </tbody></table>
    <?php endif;
}
