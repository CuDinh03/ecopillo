<?php
/**
 * Plugin Name: Ecopillo giao diện mới
 * Description: Thay giao diện ecopillo.com.vn bằng giao diện mới (trang dựng sẵn trong thư mục site/ của plugin). WordPress giữ nguyên làm nơi quản trị. Cài đặt → Giao diện mới. Đơn hàng, tin nhắn khách gửi: mục Đơn web.
 * Version: 1.1.0
 * Requires PHP: 7.4
 * Author: Ecopillo
 * Text Domain: ecopillo-giao-dien-moi
 *
 * Cách chạy (docs/ke-hoach-dua-giao-dien-moi-len-web-that.md trên máy bên làm web):
 * - Plugin chứa sẵn bản build của giao diện mới (thư mục site/, 208 trang HTML, JS, ảnh) và quy tắc .htaccess đã sinh sẵn (quy-tac/).
 * - Kích hoạt / đổi chế độ: plugin ghi một đoạn quy tắc vào .htaccess, ĐẶT TRƯỚC khối "# BEGIN WordPress",
 *   để máy chủ trả thẳng file của giao diện mới (không qua PHP, nhanh). Link nào giao diện mới không có trang thì
 *   WordPress trả như cũ: không link cũ nào ra trang lỗi.
 * - Ba chế độ: Tắt (xoá đoạn quy tắc) · Thử kín (chỉ trình duyệt đã mở /?giao-dien-moi=1 thấy giao diện mới) · Bật cho mọi người.
 *   Kích hoạt lần đầu luôn ở chế độ Thử kín. Huỷ kích hoạt plugin = Tắt.
 * - Không đụng: theme, bài viết, sản phẩm, cài đặt WordPress, khối .htaccess của WordPress và của plugin khác.
 * - Chạy được trên PHP 7.4 (hosting hiện tại) và PHP 8.
 * - Nhận đơn hàng, tin nhắn của giao diện mới tại /api/gui: nhan-form.php (lưu vào mục "Đơn web", email báo).
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/nhan-form.php';

const ECO_GDM_OPTION = 'ecopillo_giao_dien_moi_che_do';
const ECO_GDM_MARKER = 'Ecopillo giao dien moi';
const ECO_GDM_COOKIE = 'ecopillo_gdm';
const ECO_GDM_MODES = array('tat', 'thu-kin', 'bat');

/** Đường dẫn web (từ gốc tên miền) tới thư mục site/ của plugin, ví dụ /wp-content/plugins/ecopillo-giao-dien-moi/site */
function eco_gdm_site_url_path()
{
    $path = wp_parse_url(plugins_url('site', __FILE__), PHP_URL_PATH);
    return rtrim((string) $path, '/');
}

function eco_gdm_mode()
{
    $mode = get_option(ECO_GDM_OPTION, 'thu-kin');
    return in_array($mode, ECO_GDM_MODES, true) ? $mode : 'thu-kin';
}

/**
 * Các dòng quy tắc cho chế độ đang chọn; mảng rỗng khi Tắt.
 * Quy tắc do công cụ đóng gói (tools/dong-goi-plugin.mjs) sinh sẵn vào quy-tac/<chế độ>.htaccess và đã chạy thử bằng Apache;
 * ở đây chỉ thay {SITE} bằng đường dẫn thật của thư mục site/ trên máy chủ.
 */
function eco_gdm_rules($mode)
{
    if ($mode === 'tat') {
        return array();
    }
    $file = __DIR__ . '/quy-tac/' . $mode . '.htaccess';
    if (!is_readable($file)) {
        return array();
    }
    $text = str_replace('{SITE}', eco_gdm_site_url_path(), (string) file_get_contents($file));
    return explode("\n", rtrim($text, "\n"));
}

/**
 * Ghi đoạn quy tắc vào .htaccess ở gốc web, ngay trước khối "# BEGIN WordPress" (đặt sau thì quy tắc của WordPress
 * bắt mọi link trước). Trước khi ghi, chép một bản sao vào wp-content/ecopillo-gdm-sao-luu/ (có .htaccess chặn truy cập).
 * Trả true nếu ghi được.
 */
function eco_gdm_write_htaccess($mode)
{
    if (!function_exists('get_home_path')) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
    }
    $file = get_home_path() . '.htaccess';
    $current = file_exists($file) ? (string) file_get_contents($file) : '';
    if (file_exists($file) && !is_writable($file)) {
        return false;
    }

    // Bản sao trước khi sửa
    $backup_dir = WP_CONTENT_DIR . '/ecopillo-gdm-sao-luu';
    if (!is_dir($backup_dir)) {
        wp_mkdir_p($backup_dir);
        file_put_contents($backup_dir . '/.htaccess', "Require all denied\nDeny from all\n");
        file_put_contents($backup_dir . '/index.php', "<?php // Im lang.\n");
    }
    if ($current !== '') {
        file_put_contents($backup_dir . '/htaccess-' . gmdate('Ymd-His') . '.txt', $current);
    }

    // Bỏ đoạn cũ của plugin (nếu có)
    $begin = '# BEGIN ' . ECO_GDM_MARKER;
    $end = '# END ' . ECO_GDM_MARKER;
    $pattern = '/\n?' . preg_quote($begin, '/') . '.*?' . preg_quote($end, '/') . '\n?/s';
    $without = (string) preg_replace($pattern, "\n", $current);

    $rules = eco_gdm_rules($mode);
    if ($rules) {
        $block = $begin . "\n" . implode("\n", $rules) . "\n" . $end . "\n";
        $wp_begin = strpos($without, '# BEGIN WordPress');
        $next = $wp_begin === false ? $block . "\n" . ltrim($without, "\n") : substr($without, 0, $wp_begin) . $block . "\n" . substr($without, $wp_begin);
    } else {
        $next = $without;
    }
    $next = preg_replace("/\n{3,}/", "\n\n", $next);

    $tmp = $file . '.ecopillo-tmp';
    if (file_put_contents($tmp, $next) === false) {
        return false;
    }
    return rename($tmp, $file);
}

/** Xoá bộ nhớ đệm trang của LiteSpeed Cache (nếu có) để khách không nhận trang cũ đã lưu */
function eco_gdm_purge_cache()
{
    do_action('litespeed_purge_all');
}

function eco_gdm_apply($mode)
{
    update_option(ECO_GDM_OPTION, $mode, false);
    $ok = eco_gdm_write_htaccess($mode);
    eco_gdm_purge_cache();
    return $ok;
}

register_activation_hook(__FILE__, function () {
    // Lần đầu kích hoạt luôn Thử kín; kích hoạt lại thì giữ chế độ trước đó (trừ Tắt → Thử kín)
    $mode = get_option(ECO_GDM_OPTION, 'thu-kin');
    eco_gdm_apply(in_array($mode, array('thu-kin', 'bat'), true) ? $mode : 'thu-kin');
});

register_deactivation_hook(__FILE__, function () {
    eco_gdm_write_htaccess('tat');
    eco_gdm_purge_cache();
});

/** Công tắc thử: /?giao-dien-moi=1 bật cookie thử 12 giờ, =0 bỏ; rồi về lại link không có tham số */
add_action('init', function () {
    if (!isset($_GET['giao-dien-moi'])) {
        return;
    }
    $on = $_GET['giao-dien-moi'] === '1';
    setcookie(ECO_GDM_COOKIE, $on ? '1' : '', array(
        'expires' => $on ? time() + 12 * HOUR_IN_SECONDS : time() - HOUR_IN_SECONDS,
        'path' => '/',
        'secure' => is_ssl(),
        'httponly' => true,
        'samesite' => 'Lax',
    ));
    nocache_headers();
    wp_safe_redirect(remove_query_arg('giao-dien-moi'));
    exit;
}, 1);

/* ---------- Trang cài đặt: Cài đặt → Giao diện mới ---------- */

add_action('admin_menu', function () {
    add_options_page('Giao diện mới Ecopillo', 'Giao diện mới', 'manage_options', 'ecopillo-giao-dien-moi', 'eco_gdm_settings_page');
});

add_action('admin_post_eco_gdm_save', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Không có quyền.');
    }
    check_admin_referer('eco_gdm_save');
    $mode = isset($_POST['che_do']) ? sanitize_key(wp_unslash($_POST['che_do'])) : '';
    if (!in_array($mode, ECO_GDM_MODES, true)) {
        wp_die('Chế độ không hợp lệ.');
    }
    $ok = eco_gdm_apply($mode);
    wp_safe_redirect(add_query_arg(array('page' => 'ecopillo-giao-dien-moi', 'ket-qua' => $ok ? 'ok' : 'loi'), admin_url('options-general.php')));
    exit;
});

function eco_gdm_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $mode = eco_gdm_mode();
    $labels = array(
        'tat' => array('Tắt', 'Khách và người quản trị đều thấy giao diện WordPress cũ. Plugin không ghi gì vào .htaccess.'),
        'thu-kin' => array('Thử kín', 'Khách vẫn thấy web cũ. Chỉ trình duyệt đã mở link thử bên dưới mới thấy giao diện mới (12 giờ).'),
        'bat' => array('Bật cho mọi người', 'Mọi người thấy giao diện mới. Trang nào giao diện mới chưa có thì WordPress trả như cũ.'),
    );
    $info = __DIR__ . '/quy-tac/ban-build.txt';
    $version = is_readable($info) ? trim((string) file_get_contents($info)) : '';
    $test_link = home_url('/?giao-dien-moi=1');
    $off_link = home_url('/?giao-dien-moi=0');
    ?>
    <div class="wrap">
        <h1>Giao diện mới Ecopillo</h1>
        <?php if (isset($_GET['ket-qua']) && $_GET['ket-qua'] === 'ok') : ?>
            <div class="notice notice-success"><p>Đã lưu và cập nhật .htaccess. Bộ nhớ đệm LiteSpeed đã được xoá.</p></div>
        <?php elseif (isset($_GET['ket-qua'])) : ?>
            <div class="notice notice-error"><p>Không ghi được file .htaccess (máy chủ không cho ghi). Chế độ đã lưu nhưng chưa có hiệu lực: báo bên làm web.</p></div>
        <?php endif; ?>
        <p>Bản giao diện: <code><?php echo esc_html($version ?: 'không rõ'); ?></code></p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="eco_gdm_save">
            <?php wp_nonce_field('eco_gdm_save'); ?>
            <fieldset>
                <?php foreach ($labels as $key => $label) : ?>
                    <p>
                        <label>
                            <input type="radio" name="che_do" value="<?php echo esc_attr($key); ?>" <?php checked($mode, $key); ?>>
                            <strong><?php echo esc_html($label[0]); ?></strong> · <?php echo esc_html($label[1]); ?>
                        </label>
                    </p>
                <?php endforeach; ?>
            </fieldset>
            <?php submit_button('Lưu chế độ'); ?>
        </form>
        <h2>Xem thử</h2>
        <p>Ở chế độ Thử kín: mở <a href="<?php echo esc_url($test_link); ?>" target="_blank" rel="noopener"><?php echo esc_html($test_link); ?></a> để xem giao diện mới trên chính trình duyệt này; mở <a href="<?php echo esc_url($off_link); ?>" target="_blank" rel="noopener"><?php echo esc_html($off_link); ?></a> để quay lại web cũ.</p>
        <p>Gửi link thử cho người cần xem (họ cũng thấy giao diện mới sau khi mở link). Khách không có link thì vẫn thấy web cũ.</p>
        <h2>Quay lại web cũ ngay</h2>
        <p>Chọn <strong>Tắt</strong> rồi Lưu, hoặc huỷ kích hoạt plugin: đoạn quy tắc trong .htaccess được xoá, web cũ trở lại ngay.</p>
    </div>
    <?php
}
