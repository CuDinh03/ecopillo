<?php
/**
 * Nhận đơn hàng và tin nhắn của giao diện mới tại /api/gui (owner 18/11/2026: "làm phần nhận đơn, tin nhắn").
 * Làm đúng việc của hàm Cloudflare trien-khai/xem-thu/functions/api/gui.js (cùng thân JSON, cùng câu trả),
 * nên code giao diện (src/lib/sendForm.ts) không phải sửa.
 *
 * Mỗi lượt gửi hợp lệ:
 *   1. Lưu vào WordPress: mục "Đơn web" trong trang quản trị (kiểu bài riêng tư, khách ngoài không xem được).
 *   2. Gửi email báo tới các địa chỉ ở Cài đặt → Giao diện mới (mặc định ecopillo.com.vn@gmail.com, anh Quang chốt 09/11).
 *   3. Có link Apps Script + khoá thì chép thêm sang Google Trang tính (trien-khai/google-apps-script/nhan-form.gs).
 * Đã lưu ở bước 1 là trả daGui: true. Bước 2, 3 lỗi thì vẫn còn đơn trong WordPress, không mất đơn.
 *
 * Chặn máy: ô bẫy có chữ, điền dưới 2,5 giây, quá ECO_FORM_MAX_LUOT lượt / 10 phút / một địa chỉ IP, trang khác gửi hộ.
 * Giá trong đơn là giá khách thấy trên web lúc đặt; nhân viên vẫn gọi xác nhận trước khi giao (biên bản mục 50).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_FORM_PATH', '/api/gui');
define('ECO_FORM_POST_TYPE', 'ecopillo_don');
define('ECO_FORM_MAX_BODY', 16 * 1024);
/** Điền nhanh hơn mức này là máy tự điền (người thật cần vài giây để gõ tên và số điện thoại) */
define('ECO_FORM_MIN_FILL_MS', 2500);
/** Nhiều khách chung một mạng (showroom, văn phòng) có chung địa chỉ IP, nên không đặt quá thấp */
define('ECO_FORM_MAX_LUOT', 15);
define('ECO_FORM_OPT_EMAIL', 'ecopillo_form_email_nhan');
define('ECO_FORM_OPT_SCRIPT_URL', 'ecopillo_form_script_url');
define('ECO_FORM_OPT_SCRIPT_KHOA', 'ecopillo_form_script_khoa');
define('ECO_FORM_OPT_SO_DON', 'ecopillo_form_so_don');
define('ECO_FORM_EMAIL_MAC_DINH', 'ecopillo.com.vn@gmail.com');
define('ECO_FORM_PHONE', '/^(0|\+84)(3|5|7|8|9)\d{8}$/');

/** Trạng thái nhân viên ghi cho từng đơn (giống cột "Trạng thái" trong Trang tính) */
function eco_form_statuses()
{
    return array('Mới', 'Đã gọi', 'Đã chốt', 'Đã giao', 'Huỷ', 'Thử, bỏ qua');
}

function eco_form_topics()
{
    return array('Tư vấn chọn mẫu', 'Hỏi về đơn hàng', 'Bảo hành, đổi hàng', 'Khách sạn, nhà nghỉ', 'Đăng ký mở đại lý', 'Khác');
}

/* ---------------------------------------------------------------- Làm sạch dữ liệu */

/** Chuỗi gọn: bỏ ký tự điều khiển, cắt độ dài (đếm theo ký tự, không theo byte) */
function eco_form_text($value, $max)
{
    if (!is_string($value)) {
        return '';
    }
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
    if (!is_string($clean)) {
        return ''; // chuỗi không phải UTF-8 hợp lệ
    }
    return mb_substr(trim($clean), 0, $max, 'UTF-8');
}

function eco_form_money($value)
{
    if (!is_int($value) && !is_float($value)) {
        return null;
    }
    return ($value >= 0 && $value < 1e10) ? (int) round($value) : null;
}

function eco_form_phone($value)
{
    return preg_replace('/[\s.\-]/', '', eco_form_text($value, 20));
}

function eco_form_arr($value)
{
    return is_array($value) ? $value : array();
}

/** @return array{0: array, 1: string[]} dữ liệu sạch và danh sách ô thiếu */
function eco_form_clean_order($in)
{
    $k = eco_form_arr(isset($in['khach']) ? $in['khach'] : null);
    $h = eco_form_arr(isset($in['hang']) ? $in['hang'] : null);
    $t = eco_form_arr(isset($in['tien']) ? $in['tien'] : null);
    $g = function ($a, $key) {
        return isset($a[$key]) ? $a[$key] : null;
    };
    $qty = $g($h, 'soLuong');
    $order = array(
        'loai' => 'don-hang',
        'khach' => array(
            'ten' => eco_form_text($g($k, 'ten'), 80),
            'sdt' => eco_form_phone($g($k, 'sdt')),
            'tinh' => eco_form_text($g($k, 'tinh'), 60),
            'diaChi' => eco_form_text($g($k, 'diaChi'), 200),
            'ghiChu' => eco_form_text($g($k, 'ghiChu'), 500),
        ),
        'hang' => array(
            'nhom' => eco_form_text($g($h, 'nhom'), 60),
            'ten' => eco_form_text($g($h, 'ten'), 120),
            'chiTiet' => eco_form_text($g($h, 'chiTiet'), 160),
            'kichThuoc' => eco_form_text($g($h, 'kichThuoc'), 80),
            'soLuong' => (is_int($qty) && $qty > 0 && $qty <= 99) ? $qty : 0,
            'donVi' => eco_form_text($g($h, 'donVi'), 20),
            'donGia' => eco_form_money($g($h, 'donGia')),
            'qua' => eco_form_text($g($h, 'qua'), 160),
        ),
        'tien' => array(
            'tamTinh' => eco_form_money($g($t, 'tamTinh')),
            'phiGiao' => eco_form_money($g($t, 'phiGiao')),
            'tong' => eco_form_money($g($t, 'tong')),
            'baoGiaKhiGoi' => $g($t, 'baoGiaKhiGoi') === true,
        ),
    );
    $errors = array();
    if (mb_strlen($order['khach']['ten'], 'UTF-8') < 2) {
        $errors[] = 'ten';
    }
    if (!preg_match(ECO_FORM_PHONE, $order['khach']['sdt'])) {
        $errors[] = 'sdt';
    }
    if ($order['khach']['tinh'] === '') {
        $errors[] = 'tinh';
    }
    if (mb_strlen($order['khach']['diaChi'], 'UTF-8') < 6) {
        $errors[] = 'diaChi';
    }
    if ($order['hang']['ten'] === '' || !$order['hang']['soLuong']) {
        $errors[] = 'hang';
    }
    return array($order, $errors);
}

function eco_form_clean_message($in)
{
    $topic = isset($in['chuDe']) ? $in['chuDe'] : '';
    $message = array(
        'loai' => 'tin-nhan',
        'chuDe' => in_array($topic, eco_form_topics(), true) ? $topic : 'Khác',
        'ten' => eco_form_text(isset($in['ten']) ? $in['ten'] : null, 80),
        'sdt' => eco_form_phone(isset($in['sdt']) ? $in['sdt'] : null),
        'noiDung' => eco_form_text(isset($in['noiDung']) ? $in['noiDung'] : null, 2000),
    );
    $errors = array();
    if (mb_strlen($message['ten'], 'UTF-8') < 2) {
        $errors[] = 'ten';
    }
    if (!preg_match(ECO_FORM_PHONE, $message['sdt'])) {
        $errors[] = 'sdt';
    }
    if (mb_strlen($message['noiDung'], 'UTF-8') < 5) {
        $errors[] = 'noiDung';
    }
    return array($message, $errors);
}

/* ---------------------------------------------------------------- Nhận /api/gui */

function eco_form_reply($body, $status = 200)
{
    status_header($status);
    nocache_headers();
    header('Content-Type: application/json; charset=utf-8');
    header('X-Robots-Tag: noindex');
    echo wp_json_encode($body);
    exit;
}

function eco_form_request_path()
{
    $uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
    $path = (string) parse_url($uri, PHP_URL_PATH);
    return rtrim($path, '/');
}

/** Chỉ nhận từ chính trang web này (chặn trang khác gửi hộ). Không có Origin (trình duyệt cũ) thì cho qua, như gui.js */
function eco_form_same_origin()
{
    if (empty($_SERVER['HTTP_ORIGIN'])) {
        return true;
    }
    $home = wp_parse_url(home_url());
    $origin = wp_parse_url((string) $_SERVER['HTTP_ORIGIN']);
    if (!is_array($home) || !is_array($origin) || empty($origin['host'])) {
        return false;
    }
    $port = function ($u) {
        return isset($u['port']) ? (int) $u['port'] : (isset($u['scheme']) && $u['scheme'] === 'http' ? 80 : 443);
    };
    // Chấp nhận cả www. và không www. (tên miền chính có thể được mở theo hai cách)
    $strip = function ($host) {
        return preg_replace('/^www\./i', '', strtolower($host));
    };
    return $strip($origin['host']) === $strip($home['host']) && $port($origin) === $port($home);
}

/** Đếm lượt gửi theo IP (lưu tạm 10 phút). Trả true khi đã quá giới hạn */
function eco_form_rate_limited()
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'khong-ro';
    $key = 'eco_form_luot_' . md5($ip);
    $count = (int) get_transient($key);
    if ($count >= ECO_FORM_MAX_LUOT) {
        return true;
    }
    set_transient($key, $count + 1, 10 * MINUTE_IN_SECONDS);
    return false;
}

// Chạy ngay sau khi đăng ký loại "Đơn web" (nhan-form-quan-tri.php, ưu tiên 0)
add_action('init', 'eco_form_handle', 1);
function eco_form_handle()
{
    if (eco_form_request_path() !== ECO_FORM_PATH) {
        return;
    }
    if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
        eco_form_reply(array('ok' => false, 'loi' => 'phuong-thuc'), 405);
    }
    if (!eco_form_same_origin()) {
        eco_form_reply(array('ok' => false, 'loi' => 'nguon'), 403);
    }
    $type = isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '';
    if (strpos($type, 'application/json') === false) {
        eco_form_reply(array('ok' => false, 'loi' => 'kieu'), 415);
    }
    $raw = (string) file_get_contents('php://input', false, null, 0, ECO_FORM_MAX_BODY + 1);
    if (strlen($raw) > ECO_FORM_MAX_BODY) {
        eco_form_reply(array('ok' => false, 'loi' => 'qua-dai'), 413);
    }
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        eco_form_reply(array('ok' => false, 'loi' => 'json'), 400);
    }
    $kind = isset($input['loai']) ? $input['loai'] : '';
    if ($kind === 'don-hang') {
        list($data, $errors) = eco_form_clean_order($input);
    } elseif ($kind === 'tin-nhan') {
        list($data, $errors) = eco_form_clean_message($input);
    } else {
        eco_form_reply(array('ok' => false, 'loi' => 'loai'), 400);
    }
    if ($errors) {
        eco_form_reply(array('ok' => false, 'loi' => 'thieu', 'truong' => $errors), 422);
    }

    // Máy tự điền (ô bẫy có chữ, hoặc điền quá nhanh): trả như đã nhận để máy không thử lại, nhưng không lưu
    $filled = isset($input['thoiGianDien']) ? $input['thoiGianDien'] : null;
    $trap = eco_form_text(isset($input['bay']) ? $input['bay'] : null, 200);
    if ($trap !== '' || !is_numeric($filled) || (float) $filled < ECO_FORM_MIN_FILL_MS) {
        eco_form_reply(array('ok' => true, 'ma' => '', 'daGui' => false));
    }
    if (eco_form_rate_limited()) {
        eco_form_reply(array('ok' => false, 'loi' => 'nhieu-luot'), 429);
    }

    // Người quản trị đang đăng nhập gửi kèm "thu": true (thử sau khi cập nhật): đánh dấu thử, email chỉ tới người đó
    $test = !empty($input['thu']) && current_user_can('manage_options');
    $data['trang'] = esc_url_raw(eco_form_text(isset($input['trang']) ? $input['trang'] : null, 300));
    $data['thu'] = $test;
    if ($data['loai'] === 'don-hang') {
        $data['ma'] = eco_form_next_code();
    }

    $post_id = eco_form_save($data);
    if (!$post_id) {
        eco_form_reply(array('ok' => false, 'loi' => 'luu'), 500);
    }
    eco_form_notify($data, $post_id);
    eco_form_forward($data, $post_id);
    eco_form_reply(array('ok' => true, 'ma' => isset($data['ma']) ? $data['ma'] : '', 'daGui' => true));
}

/** Mã đơn EP-NGÀYTHÁNG-SỐ, số tăng dần không trùng (tăng ngay trong cơ sở dữ liệu nên hai đơn cùng lúc không trùng số) */
function eco_form_next_code()
{
    global $wpdb;
    add_option(ECO_FORM_OPT_SO_DON, '0', '', 'no');
    $wpdb->query($wpdb->prepare(
        "UPDATE {$wpdb->options} SET option_value = LAST_INSERT_ID(option_value + 1) WHERE option_name = %s",
        ECO_FORM_OPT_SO_DON
    ));
    $n = (int) $wpdb->get_var('SELECT LAST_INSERT_ID()');
    wp_cache_delete(ECO_FORM_OPT_SO_DON, 'options');
    $ddmm = wp_date('dm');
    return sprintf('EP-%s-%04d', $ddmm, $n);
}

/* ---------------------------------------------------------------- Lưu, email, Trang tính */

function eco_form_title($d)
{
    $prefix = !empty($d['thu']) ? '[THỬ] ' : '';
    if ($d['loai'] === 'don-hang') {
        return $prefix . 'Đơn ' . $d['ma'] . ' · ' . $d['hang']['ten'] . ' · ' . $d['khach']['ten'] . ' · ' . $d['khach']['sdt'];
    }
    return $prefix . 'Tin nhắn · ' . $d['chuDe'] . ' · ' . $d['ten'] . ' · ' . $d['sdt'];
}

function eco_form_save($d)
{
    $id = wp_insert_post(array(
        'post_type' => ECO_FORM_POST_TYPE,
        'post_status' => 'private',
        'post_title' => eco_form_title($d),
        'post_content' => '',
        'post_author' => 0,
    ), true);
    if (is_wp_error($id) || !$id) {
        return 0;
    }
    update_post_meta($id, '_eco_du_lieu', wp_slash(wp_json_encode($d)));
    update_post_meta($id, '_eco_loai', $d['loai']);
    update_post_meta($id, '_eco_trang_thai', !empty($d['thu']) ? 'Thử, bỏ qua' : 'Mới');
    return (int) $id;
}

function eco_form_vnd($n)
{
    return number_format((float) $n, 0, ',', '.') . 'đ';
}

/** Các dòng hiện trong email và trong trang xem đơn: [nhãn, giá trị] */
function eco_form_lines($d)
{
    if ($d['loai'] === 'don-hang') {
        $k = $d['khach'];
        $h = $d['hang'];
        $t = $d['tien'];
        $total = ($t['baoGiaKhiGoi'] || !$t['tong']) ? 'Báo giá khi gọi xác nhận' : eco_form_vnd($t['tong']);
        return array(
            array('Mã đơn', $d['ma']),
            array('Khách', $k['ten'] . ' · ' . $k['sdt']),
            array('Giao tới', $k['diaChi'] . ', ' . $k['tinh']),
            array('Ghi chú', $k['ghiChu'] !== '' ? $k['ghiChu'] : '(không)'),
            array('Hàng', $h['nhom'] . ': ' . $h['ten']),
            array('Mẫu / chi tiết', $h['chiTiet']),
            array('Kích thước', $h['kichThuoc'] !== '' ? $h['kichThuoc'] : '(không)'),
            array('Số lượng', trim($h['soLuong'] . ' ' . $h['donVi'])),
            array('Đơn giá', $h['donGia'] ? eco_form_vnd($h['donGia']) : 'Báo khi gọi'),
            array('Tạm tính', $t['tamTinh'] ? eco_form_vnd($t['tamTinh']) : ''),
            array('Phí giao', $t['phiGiao'] ? eco_form_vnd($t['phiGiao']) : 'Miễn phí / chưa tính'),
            array('Tổng (khách thấy trên web)', $total),
            array('Quà kèm', $h['qua'] !== '' ? $h['qua'] : '(không)'),
            array('Trang gửi', $d['trang']),
        );
    }
    return array(
        array('Chủ đề', $d['chuDe']),
        array('Khách', $d['ten'] . ' · ' . $d['sdt']),
        array('Nội dung', $d['noiDung']),
        array('Trang gửi', $d['trang']),
    );
}

function eco_form_recipients()
{
    $raw = (string) get_option(ECO_FORM_OPT_EMAIL, ECO_FORM_EMAIL_MAC_DINH);
    $list = array();
    foreach (preg_split('/[\s,;]+/', $raw) as $email) {
        if (is_email($email)) {
            $list[] = $email;
        }
    }
    return $list;
}

/** Email báo đơn. Lỗi gửi thư không làm hỏng lượt gửi (đơn đã nằm trong WordPress) */
function eco_form_notify($d, $post_id)
{
    if (!empty($d['thu'])) {
        $user = wp_get_current_user();
        $to = $user && is_email($user->user_email) ? array($user->user_email) : array();
    } else {
        $to = eco_form_recipients();
    }
    if (!$to) {
        return false;
    }
    $is_order = $d['loai'] === 'don-hang';
    $subject = (!empty($d['thu']) ? '[THỬ] ' : '') . ($is_order
        ? 'Đơn web ' . $d['ma'] . ' · ' . $d['hang']['ten'] . ' · ' . $d['khach']['sdt']
        : 'Tin nhắn web · ' . $d['chuDe'] . ' · ' . $d['sdt']);
    $intro = $is_order ? 'Đơn hàng mới từ web. Gọi xác nhận cho khách.' : 'Tin nhắn mới từ web. Gọi lại cho khách.';
    $link = admin_url('post.php?post=' . (int) $post_id . '&action=edit');
    $list = admin_url('edit.php?post_type=' . ECO_FORM_POST_TYPE);

    $rows = '';
    foreach (eco_form_lines($d) as $line) {
        $rows .= '<tr><td style="color:#555;vertical-align:top;padding:4px 12px 4px 0">' . esc_html($line[0])
            . '</td><td style="padding:4px 0"><b>' . nl2br(esc_html((string) $line[1])) . '</b></td></tr>';
    }
    $html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">'
        . '<p>' . esc_html($intro) . '</p><table cellspacing="0">' . $rows . '</table>'
        . '<p><a href="' . esc_url($link) . '">Xem đơn này</a> · <a href="' . esc_url($list) . '">Tất cả đơn web</a> (cần đăng nhập trang quản trị)</p></div>';

    $set_html = function () {
        return 'text/html';
    };
    add_filter('wp_mail_content_type', $set_html);
    $sent = wp_mail($to, $subject, $html, array('Reply-To: ' . $to[0]));
    remove_filter('wp_mail_content_type', $set_html);
    update_post_meta($post_id, '_eco_email', $sent ? 'Đã gửi tới ' . implode(', ', $to) : 'Gửi email không được');
    return $sent;
}

/** Chép sang Google Trang tính qua Apps Script (khi đã đặt link + khoá). Lỗi thì ghi lại, đơn vẫn còn */
function eco_form_forward($d, $post_id)
{
    $url = (string) get_option(ECO_FORM_OPT_SCRIPT_URL, '');
    $key = (string) get_option(ECO_FORM_OPT_SCRIPT_KHOA, '');
    if ($url === '' || $key === '' || strpos($url, 'https://script.google.com/') !== 0) {
        return;
    }
    $payload = $d;
    $payload['khoa'] = $key;
    $payload['xemThu'] = !empty($d['thu']);
    $payload['trinhDuyet'] = eco_form_text(isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '', 200);
    unset($payload['thu']);
    $response = wp_remote_post($url, array(
        'timeout' => 15,
        'redirection' => 5,
        'headers' => array('Content-Type' => 'application/json'),
        'body' => wp_json_encode($payload),
    ));
    $body = is_wp_error($response) ? null : json_decode(wp_remote_retrieve_body($response), true);
    $ok = is_array($body) && !empty($body['ok']);
    update_post_meta($post_id, '_eco_trang_tinh', $ok ? 'Đã chép sang Trang tính' : 'Chép sang Trang tính không được');
}

require_once __DIR__ . '/nhan-form-quan-tri.php';
