<?php
/**
 * Trang Sản phẩm → "Giá trên web": đối chiếu từng ô giá trên web với biến thể WooCommerce, nhập giá web vào Woo
 * lần đầu, bật / tắt lấy giá từ Woo, hoàn tác lần nhập. Phần tính giá ở gia-woo.php.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'eco_gia_menu');
function eco_gia_menu()
{
    add_submenu_page('edit.php?post_type=product', 'Giá trên web', 'Giá trên web', 'edit_products', 'ecopillo-gia-web', 'eco_gia_page');
}

add_action('admin_post_eco_gia_viec', 'eco_gia_action');
function eco_gia_action()
{
    if (!current_user_can('manage_woocommerce')) {
        wp_die('Không có quyền.');
    }
    check_admin_referer('eco_gia_viec');
    $job = isset($_POST['viec']) ? sanitize_key(wp_unslash($_POST['viec'])) : '';
    $result = 'ok';
    if ($job === 'nhap') {
        $result = eco_gia_import();
    } elseif ($job === 'bat') {
        update_option(ECO_GIA_OPT_BAT, '1', false);
    } elseif ($job === 'tat') {
        update_option(ECO_GIA_OPT_BAT, '0', false);
    } elseif ($job === 'hoan-tac') {
        $result = eco_gia_undo();
    } elseif ($job === 'luu-rieng') {
        $result = eco_gia_save_own(isset($_POST['rieng']) && is_array($_POST['rieng']) ? wp_unslash($_POST['rieng']) : array());
    }
    eco_dl_write();
    wp_safe_redirect(add_query_arg('ket-qua', rawurlencode($result), admin_url('edit.php?post_type=product&page=ecopillo-gia-web')));
    exit;
}

/**
 * Nhập giá web vào Woo: mỗi biến thể khớp được nhận giá web (giá gốc, bỏ giá khuyến mãi). Hai ô web khác giá cùng trỏ
 * một biến thể (ví dụ Free Size cho cả 1m6 và 1m8) thì bỏ qua biến thể đó và báo. Lưu giá cũ để hoàn tác. Nhập xong thì bật.
 */
function eco_gia_import()
{
    $wanted = array();
    $conflicts = array();
    foreach (eco_gia_compute()['rows'] as $row) {
        if (!$row['variation'] || $row['web'] === null) {
            continue;
        }
        $id = (int) $row['variation'];
        if (isset($wanted[$id]) && $wanted[$id] !== (int) $row['web']) {
            $conflicts[$id] = true;
        }
        $wanted[$id] = (int) $row['web'];
    }
    $backup = array();
    $changed = 0;
    foreach ($wanted as $id => $price) {
        if (isset($conflicts[$id])) {
            continue;
        }
        $v = wc_get_product($id);
        if (!$v) {
            continue;
        }
        $regular = (string) $v->get_regular_price();
        $sale = (string) $v->get_sale_price();
        if ($regular === (string) $price && $sale === '') {
            continue;
        }
        $backup[$id] = array('regular' => $regular, 'sale' => $sale);
        $v->set_regular_price((string) $price);
        $v->set_sale_price('');
        $v->save();
        $changed++;
    }
    if ($backup) {
        update_option(ECO_GIA_OPT_SAO_LUU, array('luc' => current_time('mysql'), 'gia' => $backup), false);
    }
    update_option(ECO_GIA_OPT_BAT, '1', false);
    return 'nhap-' . $changed . '-' . count($conflicts);
}

/** Lưu giá riêng cho các ô không có biến thể Woo. Ô để trống = bỏ giá riêng (web dùng giá có sẵn) */
function eco_gia_save_own($input)
{
    $valid = array();
    foreach (eco_gia_compute()['rows'] as $row) {
        if (!$row['variation']) {
            $valid[$row['id']] = true;
        }
    }
    $own = array();
    $count = 0;
    foreach ($input as $id => $value) {
        $id = (string) $id;
        $digits = preg_replace('/\D+/', '', (string) $value);
        if (!isset($valid[$id]) || $digits === '') {
            continue;
        }
        $price = (int) $digits;
        if ($price > 0 && $price < 10000000000) {
            $own[$id] = $price;
            $count++;
        }
    }
    update_option(ECO_GIA_OPT_RIENG, $own, false);
    return 'rieng-' . $count;
}

function eco_gia_undo()
{
    $backup = get_option(ECO_GIA_OPT_SAO_LUU);
    if (!is_array($backup) || empty($backup['gia'])) {
        return 'khong-co-sao-luu';
    }
    foreach ($backup['gia'] as $id => $old) {
        $v = wc_get_product((int) $id);
        if ($v) {
            $v->set_regular_price((string) $old['regular']);
            $v->set_sale_price((string) $old['sale']);
            $v->save();
        }
    }
    delete_option(ECO_GIA_OPT_SAO_LUU);
    update_option(ECO_GIA_OPT_BAT, '0', false);
    return 'hoan-tac';
}

function eco_gia_vnd($n)
{
    return $n === null ? '–' : number_format((float) $n, 0, ',', '.') . 'đ';
}

function eco_gia_page()
{
    if (!current_user_can('edit_products')) {
        return;
    }
    if (!function_exists('wc_get_product')) {
        echo '<div class="wrap"><h1>Giá trên web</h1><p>Cần bật WooCommerce.</p></div>';
        return;
    }
    $rows = eco_gia_compute()['rows'];
    $count = array('Khớp' => 0, 'Khác' => 0, 'khac' => 0);  // khac: chưa ghép được hoặc dùng giá riêng
    foreach ($rows as $r) {
        if ($r['ghiChu'] === 'Khớp') {
            $count['Khớp']++;
        } elseif ($r['ghiChu'] === 'Khác') {
            $count['Khác']++;
        } else {
            $count['khac']++;
        }
    }
    $enabled = eco_gia_enabled();
    $backup = get_option(ECO_GIA_OPT_SAO_LUU);
    $can_edit = current_user_can('manage_woocommerce');
    $result = isset($_GET['ket-qua']) ? sanitize_text_field(wp_unslash($_GET['ket-qua'])) : '';
    $button = function ($job, $label, $class = 'secondary', $confirm = '') {
        echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" style="display:inline-block;margin:0 8px 8px 0"'
            . ($confirm ? ' onsubmit="return confirm(' . esc_attr(wp_json_encode($confirm)) . ')"' : '') . '>';
        echo '<input type="hidden" name="action" value="eco_gia_viec"><input type="hidden" name="viec" value="' . esc_attr($job) . '">';
        wp_nonce_field('eco_gia_viec');
        submit_button($label, $class, 'submit', false);
        echo '</form>';
    };
    ?>
    <div class="wrap">
        <h1>Giá trên web</h1>
        <?php if (preg_match('/^nhap-(\d+)-(\d+)$/', $result, $m)) : ?>
            <div class="notice notice-success"><p>Đã nhập giá web vào <?php echo (int) $m[1]; ?> biến thể và bật lấy giá từ WooCommerce.<?php echo $m[2] ? ' ' . (int) $m[2] . ' biến thể bị bỏ qua vì hai cỡ trên web khác giá nhưng Woo chung một biến thể: xem dòng "Khác" bên dưới.' : ''; ?></p></div>
        <?php elseif (preg_match('/^rieng-(\d+)$/', $result, $m)) : ?>
            <div class="notice notice-success"><p>Đã lưu <?php echo (int) $m[1]; ?> giá riêng.<?php echo $enabled ? '' : ' Web dùng các giá này sau khi bật lấy giá.'; ?></p></div>
        <?php elseif ($result === 'hoan-tac') : ?>
            <div class="notice notice-success"><p>Đã trả lại giá Woo như trước lần nhập và tắt lấy giá từ Woo.</p></div>
        <?php elseif ($result !== '') : ?>
            <div class="notice notice-info"><p>Đã lưu.</p></div>
        <?php endif; ?>

        <p><strong>Trạng thái:</strong> <?php echo $enabled
            ? 'Web đang lấy giá và hết hàng từ WooCommerce. Sửa giá trong Sản phẩm → bấm Cập nhật: web đổi ngay (khách tải lại trang là thấy).'
            : 'Web đang dùng giá có sẵn trong giao diện. Giá trong WooCommerce chưa được dùng.'; ?></p>
        <p>Đã ghi file giá lúc: <?php echo esc_html((string) get_option(ECO_GIA_OPT_GHI_LUC, 'chưa ghi')); ?> ·
            <?php echo (int) $count['Khớp']; ?> ô khớp · <?php echo (int) $count['Khác']; ?> ô khác giá · <?php echo (int) $count['khac']; ?> ô chưa ghép được (web giữ giá có sẵn)</p>

        <?php if ($can_edit) : ?>
            <p>
                <?php
                if (!$enabled) {
                    $button('nhap', 'Nhập giá web vào WooCommerce và bật', 'primary', 'Giá của các biến thể khớp sẽ được đổi thành giá đang hiện trên web (lưu giá cũ để hoàn tác). Tiếp tục?');
                    $button('bat', 'Bật mà không nhập giá', 'secondary', 'Web sẽ hiện ngay giá đang có trong WooCommerce (có thể là giá cũ). Tiếp tục?');
                } else {
                    $button('ghi', 'Cập nhật web ngay');
                    $button('tat', 'Tắt lấy giá từ Woo', 'secondary', 'Web quay về giá có sẵn trong giao diện. Tiếp tục?');
                }
                if (is_array($backup) && !empty($backup['gia'])) {
                    $button('hoan-tac', 'Hoàn tác lần nhập (' . count($backup['gia']) . ' biến thể)', 'secondary', 'Trả giá Woo về như trước lần nhập và tắt lấy giá từ Woo. Tiếp tục?');
                }
                ?>
            </p>
        <?php endif; ?>

        <h2>Mẫu mới thêm trong WooCommerce</h2>
        <p>Thêm mẫu: Sản phẩm → Thêm mới; xếp vào danh mục bộ sưu tập (ví dụ "Bộ sưu tập Eco Rosa"); ô <strong>Mã sản phẩm</strong> ghi mã mẫu (ví dụ ER50); dòng đầu <strong>Mô tả ngắn</strong> ghi tên màu; đặt ảnh sản phẩm và ảnh thư viện sản phẩm; biến thể theo cỡ như các mẫu cũ (Free Size, 200*220; Bộ ga phủ / Bộ ga chun chần). Đăng là mẫu hiện trên web<?php echo $enabled ? '' : ' (sau khi bật lấy giá từ Woo)'; ?>.</p>
        <?php
        $new_rows = $enabled ? eco_mm_compute()['rows'] : array();
        if (!$new_rows) :
            ?><p style="color:#555"><?php echo $enabled ? 'Chưa có mẫu mới.' : 'Bật lấy giá từ Woo để dùng.'; ?></p><?php
        else :
            ?>
            <table class="widefat striped" style="margin-bottom:24px"><thead><tr><th>Sản phẩm Woo</th><th>Bộ sưu tập</th><th>Mã</th><th>Trạng thái</th></tr></thead><tbody>
            <?php foreach ($new_rows as $nr) : ?>
                <tr><td><a href="<?php echo esc_url(get_edit_post_link($nr['id'])); ?>"><?php echo esc_html($nr['ten']); ?></a></td><td><?php echo esc_html($nr['bo']); ?></td><td><?php echo esc_html($nr['ma']); ?></td>
                    <td style="<?php echo strpos($nr['trangThai'], 'Chưa') === 0 ? 'color:#b32d2e;font-weight:600' : ''; ?>"><?php echo esc_html($nr['trangThai']); ?></td></tr>
            <?php endforeach; ?>
            </tbody></table>
        <?php endif; ?>

        <h2>Đối chiếu từng ô giá</h2>
        <p>Ô có biến thể Woo: sửa giá trong Sản phẩm (bấm tên sản phẩm). Ô <strong>"Chưa ghép được"</strong> (Woo chưa có sản phẩm hoặc cỡ đó): điền giá ở cột "Giá riêng" rồi bấm "Lưu giá riêng" cuối bảng. Để trống thì web giữ giá có sẵn.</p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="eco_gia_viec"><input type="hidden" name="viec" value="luu-rieng">
        <?php wp_nonce_field('eco_gia_viec'); ?>
        <table class="widefat striped">
            <thead><tr><th>Sản phẩm trên web</th><th>Ô</th><th>Giá web (bản dựng)</th><th>Giá Woo</th><th>Giá riêng</th><th>Đối chiếu</th></tr></thead>
            <tbody>
            <?php foreach ($rows as $r) :
                $parent = $r['variation'] ? wp_get_post_parent_id($r['variation']) : 0;
                $edit = $parent ? get_edit_post_link($parent) : ($r['variation'] ? get_edit_post_link($r['variation']) : '');
                $style = $r['ghiChu'] === 'Khớp' ? '' : ($r['ghiChu'] === 'Khác' ? 'color:#8a5a00;font-weight:600' : 'color:#b32d2e;font-weight:600');
                ?>
                <tr>
                    <td><?php echo $edit ? '<a href="' . esc_url($edit) . '">' . esc_html($r['ten']) . '</a>' : esc_html($r['ten']); ?></td>
                    <td><?php echo esc_html($r['o']); ?></td>
                    <td><?php echo esc_html(eco_gia_vnd($r['web'])); ?></td>
                    <td><?php echo esc_html(eco_gia_vnd($r['woo'])); ?></td>
                    <td><?php if (!$r['variation'] && $can_edit) : ?>
                        <input type="text" inputmode="numeric" name="rieng[<?php echo esc_attr($r['id']); ?>]" value="<?php echo $r['rieng'] !== null ? esc_attr((string) $r['rieng']) : ''; ?>" placeholder="<?php echo esc_attr((string) $r['web']); ?>" style="width:120px">
                    <?php else : ?>–<?php endif; ?></td>
                    <td style="<?php echo esc_attr($style); ?>"><?php echo esc_html($r['ghiChu']); ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php if ($can_edit) : ?><p><?php submit_button('Lưu giá riêng', 'primary', 'submit', false); ?></p><?php endif; ?>
        </form>
    </div>
    <?php
}
