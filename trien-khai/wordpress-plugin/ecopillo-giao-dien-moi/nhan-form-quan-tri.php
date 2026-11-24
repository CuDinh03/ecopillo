<?php
/**
 * Trang quản trị "Đơn web": danh sách đơn hàng và tin nhắn khách gửi từ giao diện mới, ghi trạng thái,
 * và cài đặt nơi nhận (email, Google Trang tính). Phần nhận ở nhan-form.php.
 * Chỉ người có quyền sửa bài của người khác (Biên tập viên, Quản trị viên) mới xem được: đơn có số điện thoại, địa chỉ khách.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'eco_form_register_type', 0);
function eco_form_register_type()
{
    register_post_type(ECO_FORM_POST_TYPE, array(
        'labels' => array(
            'name' => 'Đơn web',
            'singular_name' => 'Đơn web',
            'menu_name' => 'Đơn web',
            'all_items' => 'Đơn hàng, tin nhắn',
            'edit_item' => 'Xem đơn',
            'search_items' => 'Tìm đơn',
            'not_found' => 'Chưa có đơn nào',
            'not_found_in_trash' => 'Thùng rác trống',
        ),
        'public' => false,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'show_in_rest' => false,
        'show_in_nav_menus' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 26,
        'menu_icon' => 'dashicons-cart',
        'supports' => array('title'),
        'rewrite' => false,
        'query_var' => false,
        'capability_type' => 'post',
        'map_meta_cap' => true,
        'capabilities' => array(
            'create_posts' => 'do_not_allow', // đơn chỉ đến từ web, không thêm tay
            'edit_posts' => 'edit_others_posts',
            'read_private_posts' => 'edit_others_posts',
        ),
    ));
}

/** Đọc lại dữ liệu đã lưu của một đơn */
function eco_form_data($post_id)
{
    $data = json_decode((string) get_post_meta($post_id, '_eco_du_lieu', true), true);
    return is_array($data) ? $data : null;
}

/* ---------------------------------------------------------------- Danh sách */

add_filter('manage_' . ECO_FORM_POST_TYPE . '_posts_columns', 'eco_form_columns');
function eco_form_columns($columns)
{
    return array(
        'cb' => isset($columns['cb']) ? $columns['cb'] : '',
        'title' => 'Đơn / tin nhắn',
        'eco_trang_thai' => 'Trạng thái',
        'eco_tong' => 'Tổng',
        'eco_email' => 'Email báo',
        'date' => 'Lúc gửi',
    );
}

add_action('manage_' . ECO_FORM_POST_TYPE . '_posts_custom_column', 'eco_form_column', 10, 2);
function eco_form_column($column, $post_id)
{
    if ($column === 'eco_trang_thai') {
        $status = (string) get_post_meta($post_id, '_eco_trang_thai', true);
        $style = $status === 'Mới' ? 'background:#ffc271;color:#111;padding:2px 8px;border-radius:10px;font-weight:600' : '';
        echo '<span style="' . esc_attr($style) . '">' . esc_html($status) . '</span>';
        $note = (string) get_post_meta($post_id, '_eco_ghi_chu', true);
        if ($note !== '') {
            echo '<br><span style="color:#555" title="' . esc_attr($note) . '">Ghi chú: ' . esc_html(mb_substr($note, 0, 60, 'UTF-8')) . (mb_strlen($note, 'UTF-8') > 60 ? '…' : '') . '</span>';
        }
    } elseif ($column === 'eco_tong') {
        $d = eco_form_data($post_id);
        if ($d && $d['loai'] === 'don-hang') {
            echo esc_html($d['tien']['tong'] && !$d['tien']['baoGiaKhiGoi'] ? eco_form_vnd($d['tien']['tong']) : 'Báo giá khi gọi');
        } else {
            echo 'Tin nhắn';
        }
    } elseif ($column === 'eco_email') {
        echo esc_html((string) get_post_meta($post_id, '_eco_email', true));
    }
}

/** Đếm đơn "Mới" hiện cạnh tên menu */
add_action('admin_menu', 'eco_form_menu_badge', 99);
function eco_form_menu_badge()
{
    global $menu;
    if (!current_user_can('edit_others_posts') || !is_array($menu)) {
        return;
    }
    $count = count(get_posts(array(
        'post_type' => ECO_FORM_POST_TYPE,
        'post_status' => 'private',
        'fields' => 'ids',
        'posts_per_page' => 100,
        'meta_key' => '_eco_trang_thai',
        'meta_value' => 'Mới',
        'no_found_rows' => true,
    )));
    if (!$count) {
        return;
    }
    foreach ($menu as $i => $item) {
        if (isset($item[2]) && $item[2] === 'edit.php?post_type=' . ECO_FORM_POST_TYPE) {
            $menu[$i][0] .= ' <span class="awaiting-mod"><span class="pending-count">' . (int) $count . '</span></span>';
        }
    }
}

/* ---------------------------------------------------------------- Xem một đơn, ghi trạng thái */

add_action('add_meta_boxes_' . ECO_FORM_POST_TYPE, 'eco_form_meta_boxes');
function eco_form_meta_boxes()
{
    add_meta_box('eco_form_chi_tiet', 'Chi tiết khách gửi', 'eco_form_box_detail', ECO_FORM_POST_TYPE, 'normal', 'high');
    add_meta_box('eco_form_trang_thai', 'Trạng thái', 'eco_form_box_status', ECO_FORM_POST_TYPE, 'side', 'high');
    remove_meta_box('slugdiv', ECO_FORM_POST_TYPE, 'normal');
}

function eco_form_box_detail($post)
{
    $d = eco_form_data($post->ID);
    if (!$d) {
        echo '<p>Không đọc được dữ liệu đơn.</p>';
        return;
    }
    echo '<table class="widefat striped" style="border:0"><tbody>';
    foreach (eco_form_lines($d) as $line) {
        $value = (string) $line[1];
        if ($line[0] === 'Khách') {
            $phone = $d['loai'] === 'don-hang' ? $d['khach']['sdt'] : $d['sdt'];
            $value = esc_html($value) . ' · <a href="tel:' . esc_attr($phone) . '">Gọi</a>';
        } elseif ($line[0] === 'Trang gửi' && $value !== '') {
            $value = '<a href="' . esc_url($value) . '" target="_blank" rel="noopener noreferrer">' . esc_html($value) . '</a>';
        } else {
            $value = nl2br(esc_html($value));
        }
        echo '<tr><th style="width:190px">' . esc_html($line[0]) . '</th><td>' . $value . '</td></tr>'; // $value đã thoát ở trên
    }
    echo '</tbody></table>';
    $mail = (string) get_post_meta($post->ID, '_eco_email', true);
    echo '<p style="color:#555">Email báo: ' . esc_html($mail ?: 'không gửi') . '</p>';
}

function eco_form_box_status($post)
{
    wp_nonce_field('eco_form_status', 'eco_form_status_nonce');
    $current = (string) get_post_meta($post->ID, '_eco_trang_thai', true);
    echo '<p>Ghi lại đã xử lý tới đâu:</p>';
    foreach (eco_form_statuses() as $status) {
        echo '<label style="display:block;margin:4px 0"><input type="radio" name="eco_trang_thai" value="' . esc_attr($status) . '" '
            . checked($current, $status, false) . '> ' . esc_html($status) . '</label>';
    }
    // Ghi chú nội bộ (đợt E3): chỉ người trong wp-admin thấy, không gửi đi đâu
    $note = (string) get_post_meta($post->ID, '_eco_ghi_chu', true);
    echo '<p style="margin-top:12px"><label for="eco_ghi_chu"><strong>Ghi chú nội bộ</strong></label><br>'
        . '<textarea id="eco_ghi_chu" name="eco_ghi_chu" rows="5" style="width:100%" maxlength="3000">' . esc_textarea($note) . '</textarea></p>';
    echo '<p style="color:#555">Bấm "Cập nhật" ở trên để lưu.</p>';
}

add_action('save_post_' . ECO_FORM_POST_TYPE, 'eco_form_save_status', 10, 2);
function eco_form_save_status($post_id, $post)
{
    if (!isset($_POST['eco_form_status_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eco_form_status_nonce'])), 'eco_form_status')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    $status = isset($_POST['eco_trang_thai']) ? sanitize_text_field(wp_unslash($_POST['eco_trang_thai'])) : '';
    if (in_array($status, eco_form_statuses(), true)) {
        update_post_meta($post_id, '_eco_trang_thai', $status);
    }
    if (isset($_POST['eco_ghi_chu'])) {
        $note = mb_substr(sanitize_textarea_field(wp_unslash($_POST['eco_ghi_chu'])), 0, 3000, 'UTF-8');
        if ($note === '') {
            delete_post_meta($post_id, '_eco_ghi_chu');
        } else {
            update_post_meta($post_id, '_eco_ghi_chu', $note);
        }
    }
}

/* ---------------------------------------------------------------- Đổi trạng thái nhiều đơn một lúc (đợt E3) */

add_filter('bulk_actions-edit-' . ECO_FORM_POST_TYPE, function ($actions) {
    foreach (eco_form_statuses() as $i => $status) {
        $actions['eco_trang_thai_' . $i] = 'Đổi trạng thái: ' . $status;
    }
    return $actions;
});

add_filter('handle_bulk_actions-edit-' . ECO_FORM_POST_TYPE, function ($redirect, $action, $ids) {
    if (strpos($action, 'eco_trang_thai_') !== 0) {
        return $redirect;
    }
    $statuses = eco_form_statuses();
    $index = (int) substr($action, strlen('eco_trang_thai_'));
    if (!isset($statuses[$index])) {
        return $redirect;
    }
    $done = 0;
    foreach ((array) $ids as $id) {
        if (current_user_can('edit_post', (int) $id) && get_post_type((int) $id) === ECO_FORM_POST_TYPE) {
            update_post_meta((int) $id, '_eco_trang_thai', $statuses[$index]);
            $done++;
        }
    }
    return add_query_arg('eco_doi_trang_thai', $done, $redirect);
}, 10, 3);

add_action('admin_notices', function () {
    if (isset($_GET['eco_doi_trang_thai'], $_GET['post_type']) && $_GET['post_type'] === ECO_FORM_POST_TYPE) {
        echo '<div class="notice notice-success is-dismissible"><p>Đã đổi trạng thái ' . (int) $_GET['eco_doi_trang_thai'] . ' đơn.</p></div>';
    }
});

/** Đơn luôn ở trạng thái riêng tư: nút "Cập nhật" của WordPress không được làm đơn thành công khai */
add_filter('wp_insert_post_data', 'eco_form_keep_private', 10, 2);
function eco_form_keep_private($data, $postarr)
{
    if (isset($data['post_type']) && $data['post_type'] === ECO_FORM_POST_TYPE && $data['post_status'] !== 'trash') {
        $data['post_status'] = 'private';
    }
    return $data;
}

/* ---------------------------------------------------------------- Cài đặt nơi nhận */

add_action('admin_menu', 'eco_form_settings_menu');
function eco_form_settings_menu()
{
    add_submenu_page('edit.php?post_type=' . ECO_FORM_POST_TYPE, 'Cài đặt nhận đơn', 'Cài đặt nhận đơn', 'manage_options', 'ecopillo-nhan-don', 'eco_form_settings_page');
}

add_action('admin_post_eco_form_settings', 'eco_form_settings_save');
function eco_form_settings_save()
{
    if (!current_user_can('manage_options')) {
        wp_die('Không có quyền.');
    }
    check_admin_referer('eco_form_settings');
    $back = admin_url('edit.php?post_type=' . ECO_FORM_POST_TYPE . '&page=ecopillo-nhan-don');

    if (isset($_POST['gui_thu'])) {
        $user = wp_get_current_user();
        $ok = $user && is_email($user->user_email) && wp_mail(
            $user->user_email,
            '[THỬ] Web Ecopillo gửi được email',
            'Thư thử từ trang Cài đặt nhận đơn. Nhận được thư này là máy chủ web gửi được email. Kiểm cả hộp thư Spam.'
        );
        wp_safe_redirect(add_query_arg('ket-qua', $ok ? 'thu-ok' : 'thu-loi', $back));
        exit;
    }

    $emails = array();
    $raw = isset($_POST['email_nhan']) ? sanitize_textarea_field(wp_unslash($_POST['email_nhan'])) : '';
    foreach (preg_split('/[\s,;]+/', $raw) as $email) {
        if (is_email($email)) {
            $emails[] = sanitize_email($email);
        }
    }
    update_option(ECO_FORM_OPT_EMAIL, implode(', ', $emails), false);
    // Các trạng thái đơn Ecopillo tự đặt (đợt F); "Mới" và "Thử, bỏ qua" luôn có (đếm đơn mới, đơn thử)
    if (isset($_POST['trang_thai'])) {
        $lines = array();
        foreach (preg_split('/\R/u', sanitize_textarea_field(wp_unslash($_POST['trang_thai']))) as $line) {
            $line = mb_substr(trim($line), 0, 40, 'UTF-8');
            if ($line !== '' && !in_array($line, $lines, true)) {
                $lines[] = $line;
            }
        }
        update_option(ECO_FORM_OPT_TRANG_THAI, array_slice($lines, 0, 20), false);
    }
    wp_safe_redirect(add_query_arg('ket-qua', 'ok', $back));
    exit;
}

function eco_form_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $emails = (string) get_option(ECO_FORM_OPT_EMAIL, ECO_FORM_EMAIL_MAC_DINH);
    $result = isset($_GET['ket-qua']) ? sanitize_key(wp_unslash($_GET['ket-qua'])) : '';
    $notices = array(
        'ok' => array('success', 'Đã lưu.'),
        'thu-ok' => array('success', 'Đã gửi thư thử tới email của tài khoản đang đăng nhập. Kiểm cả hộp thư Spam.'),
        'thu-loi' => array('error', 'Máy chủ không gửi được thư. Đơn vẫn được lưu trong mục Đơn web; báo bên làm web.'),
    );
    ?>
    <div class="wrap">
        <h1>Cài đặt nhận đơn</h1>
        <?php if (isset($notices[$result])) : ?>
            <div class="notice notice-<?php echo esc_attr($notices[$result][0]); ?>"><p><?php echo esc_html($notices[$result][1]); ?></p></div>
        <?php endif; ?>
        <p>Đơn hàng và tin nhắn khách gửi từ web chỉ được lưu ở mục <a href="<?php echo esc_url(admin_url('edit.php?post_type=' . ECO_FORM_POST_TYPE)); ?>">Đơn web</a>, chỉ người đăng nhập trang quản trị mới xem được.</p>
        <p>Mỗi đơn có email báo (kèm thông tin khách để gọi lại) tới các địa chỉ dưới. Chỉ điền email của Ecopillo. Đơn không được gửi sang dịch vụ nào khác.</p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="eco_form_settings">
            <?php wp_nonce_field('eco_form_settings'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="email_nhan">Email nhận báo</label></th>
                    <td><textarea id="email_nhan" name="email_nhan" rows="2" class="large-text"><?php echo esc_textarea($emails); ?></textarea>
                        <p class="description">Nhiều email thì cách nhau bằng dấu phẩy. Để trống: không gửi email, đơn vẫn lưu.</p></td>
                </tr>
                <tr>
                    <th scope="row"><label for="trang_thai">Các trạng thái đơn</label></th>
                    <td><textarea id="trang_thai" name="trang_thai" rows="7" class="large-text"><?php echo esc_textarea(implode("\n", eco_form_statuses())); ?></textarea>
                        <p class="description">Mỗi dòng một trạng thái, theo thứ tự hiện ở cột phải khi xem đơn và ở "Đổi trạng thái" hàng loạt. "Mới" (đơn vừa tới, đếm ở menu) và "Thử, bỏ qua" luôn có. Đổi tên một trạng thái thì đơn cũ vẫn giữ tên cũ.</p></td>
                </tr>
            </table>
            <p class="submit">
                <?php submit_button('Lưu', 'primary', 'submit', false); ?>
                <?php submit_button('Gửi thư thử tới email của tôi', 'secondary', 'gui_thu', false); ?>
            </p>
        </form>
    </div>
    <?php
}
