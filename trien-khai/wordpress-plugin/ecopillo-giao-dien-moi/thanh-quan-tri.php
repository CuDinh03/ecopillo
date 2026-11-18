<?php
/**
 * Thanh quản trị trên giao diện mới (anh Quang 18/11/2026: "anh muốn để trang quản trị ra ngoài thế này vào cho nhanh.
 * cái này chỉ admin nhìn thấy thôi không ảnh hưởng đến người xem"; owner duyệt, plugin 1.7.2).
 *
 * Trang giao diện mới là file tĩnh máy chủ đưa thẳng (.htaccess), không chạy qua PHP, nên thanh của WordPress không chèn được.
 * Cách làm:
 * - Người có quyền viết bài đăng nhập (hoặc mở wp-admin) thì có thêm cookie đánh dấu ECO_QT_COOKIE (không phải httpOnly,
 *   không chứa gì bí mật; chỉ để giao diện biết có nên hỏi hay không). Đăng xuất thì xoá.
 * - Giao diện (src/components/layout/AdminBar.tsx) thấy cookie mới gọi admin-ajax.php?action=eco_thanh_qt; ở đây kiểm đăng nhập
 *   và quyền thật rồi mới trả link. Khách không có cookie nên không phát sinh yêu cầu nào; ai tự tạo cookie giả chỉ nhận {hien:false}.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_QT_COOKIE', 'eco_qt');
/** Quyền tối thiểu để thấy thanh */
define('ECO_QT_CAP', 'edit_posts');

function eco_qt_set_cookie($expire)
{
    if (headers_sent()) {
        return;
    }
    setcookie(ECO_QT_COOKIE, $expire > 0 ? '1' : '', array(
        'expires' => $expire > 0 ? (int) $expire : time() - YEAR_IN_SECONDS,
        'path' => '/',
        'domain' => COOKIE_DOMAIN ? COOKIE_DOMAIN : '',
        'secure' => is_ssl(),
        'httponly' => false, // giao diện cần đọc được; cookie không cho quyền gì
        'samesite' => 'Lax',
    ));
}

/** WordPress đặt cookie đăng nhập: người đủ quyền thì đặt kèm cookie đánh dấu, cùng hạn */
add_action('set_logged_in_cookie', 'eco_qt_on_login', 10, 4);
function eco_qt_on_login($logged_in_cookie, $expire, $expiration, $user_id)
{
    if (user_can((int) $user_id, ECO_QT_CAP)) {
        eco_qt_set_cookie($expire ? $expire : $expiration);
    }
}

/** Đăng xuất (WordPress xoá cookie đăng nhập): xoá cookie đánh dấu */
add_action('clear_auth_cookie', 'eco_qt_on_logout');
function eco_qt_on_logout()
{
    eco_qt_set_cookie(0);
}

/** Đã đăng nhập từ trước khi cài bản này: mở wp-admin là có cookie (14 ngày; hết đăng nhập thì giao diện tự xoá) */
add_action('admin_init', 'eco_qt_refresh_cookie');
function eco_qt_refresh_cookie()
{
    if (!isset($_COOKIE[ECO_QT_COOKIE]) && current_user_can(ECO_QT_CAP)) {
        eco_qt_set_cookie(time() + 14 * DAY_IN_SECONDS);
    }
}

/** Link "Sửa trang này" theo đường dẫn đang xem */
function eco_qt_edit_link($path)
{
    $path = '/' . trim((string) $path, '/') . '/';
    if (strpos($path, '/danh-muc-san-pham/') === 0 && current_user_can(ECO_ND_CAP)) {
        return array('nhan' => 'Sửa sản phẩm trong trang', 'url' => admin_url('admin.php?page=ecopillo-nd-san-pham-trong-danh-muc'));
    }
    if (preg_match('#^/san-pham/([a-z0-9-]+)/$#', $path, $m)) {
        $post = get_page_by_path($m[1], OBJECT, 'product');
        if ($post && current_user_can('edit_post', $post->ID)) {
            return array('nhan' => 'Sửa sản phẩm', 'url' => get_edit_post_link($post->ID, 'raw'));
        }
        return null;
    }
    if (preg_match('#^/([a-z0-9-]+)/$#', $path, $m)) {
        $post = get_page_by_path($m[1], OBJECT, 'post');
        if ($post && current_user_can('edit_post', $post->ID)) {
            return array('nhan' => 'Sửa bài viết', 'url' => get_edit_post_link($post->ID, 'raw'));
        }
    }
    return null;
}

add_action('wp_ajax_eco_thanh_qt', 'eco_qt_ajax');
add_action('wp_ajax_nopriv_eco_thanh_qt', 'eco_qt_ajax');
function eco_qt_ajax()
{
    nocache_headers();
    if (!is_user_logged_in() || !current_user_can(ECO_QT_CAP)) {
        wp_send_json(array('hien' => false));
    }
    $path = isset($_GET['duong']) ? sanitize_text_field(wp_unslash($_GET['duong'])) : '/';
    $links = array(array('nhan' => 'Bảng tin', 'url' => admin_url()));
    $edit = eco_qt_edit_link(parse_url($path, PHP_URL_PATH));
    if ($edit) {
        $links[] = $edit + array('noi' => true);
    }
    $links[] = array('nhan' => 'Viết bài mới', 'url' => admin_url('post-new.php'));
    if (post_type_exists('product') && current_user_can('edit_products')) {
        $links[] = array('nhan' => 'Thêm sản phẩm', 'url' => admin_url('post-new.php?post_type=product'));
    }
    if (current_user_can(ECO_ND_CAP)) {
        $links[] = array('nhan' => 'Nội dung web', 'url' => admin_url('admin.php?page=ecopillo-noi-dung'));
    }
    if (current_user_can('edit_others_posts')) {
        $links[] = array('nhan' => 'Đơn web', 'url' => admin_url('edit.php?post_type=' . ECO_FORM_POST_TYPE));
    }
    if (post_type_exists('product') && current_user_can('edit_products')) {
        $links[] = array('nhan' => 'Giá trên web', 'url' => admin_url('edit.php?post_type=product&page=ecopillo-gia-web'));
    }
    $user = wp_get_current_user();
    wp_send_json(array(
        'hien' => true,
        'ten' => $user->display_name,
        'links' => $links,
        'thoat' => html_entity_decode(wp_logout_url(home_url('/'))), // wp_nonce_url trả &amp;
    ));
}
