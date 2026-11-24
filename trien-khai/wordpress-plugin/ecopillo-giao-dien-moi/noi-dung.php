<?php
/**
 * Nội dung web Ecopillo tự sửa (giai đoạn 2, docs/ke-hoach-khach-tu-sua-du-lieu.md): liên hệ, mạng xã hội,
 * văn phòng, đại lý, banner, sự kiện, báo chí, cảm nhận khách.
 *
 * - du-lieu/noi-dung-goc.json (sinh lúc build, src/data/contentFrame.ts): từng bộ dữ liệu, các ô sửa được, giá trị gốc.
 * - Ecopillo sửa ở menu "Nội dung web" (noi-dung-quan-tri.php); mỗi bộ lưu một tuỳ chọn WordPress.
 * - Bộ đã lưu được ghi vào du-lieu.js (`window.__ECO_NOI_DUNG__`, cùng file với giá: gia-woo.php → eco_dl_write).
 *   Bộ chưa lưu: web dùng nội dung trong code. Web kiểm lại từng ô (src/data/liveContent.ts).
 * - Chỉ là nội dung công khai trên web. Không gửi đi đâu.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_ND_OPT_PREFIX', 'ecopillo_nd_');
define('ECO_ND_CAP', 'edit_pages');

/** Các bộ dữ liệu, khoá theo mã bộ */
function eco_nd_sets()
{
    static $sets = null;
    if ($sets === null) {
        $sets = array();
        $file = __DIR__ . '/du-lieu/noi-dung-goc.json';
        $data = is_readable($file) ? json_decode((string) file_get_contents($file), true) : null;
        foreach ((is_array($data) && isset($data['boDuLieu']) ? $data['boDuLieu'] : array()) as $set) {
            if (is_array($set) && isset($set['khoa'], $set['truong'], $set['kieu'])) {
                $sets[(string) $set['khoa']] = $set;
            }
        }
    }
    return $sets;
}

function eco_nd_saved($key)
{
    $value = get_option(ECO_ND_OPT_PREFIX . $key, null);
    return is_array($value) && array_key_exists('giaTri', $value) ? $value : null;
}

/** Giá trị đang dùng: bản Ecopillo đã lưu, chưa lưu thì bản gốc */
function eco_nd_current($set)
{
    $saved = eco_nd_saved($set['khoa']);
    if (!$saved) {
        return $set['goc'];
    }
    // Bộ "mot" có ô mới thêm sau lần lưu (ví dụ tài khoản ngân hàng ở Liên hệ, 1.7.3): điền sẵn giá trị gốc cho ô thiếu
    if ($set['kieu'] === 'mot' && is_array($saved['giaTri']) && is_array($set['goc'])) {
        return array_merge($set['goc'], $saved['giaTri']);
    }
    return $saved['giaTri'];
}

/* ---------------------------------------------------------------- Kiểm từng ô (giống cleanField trong liveContent.ts) */

function eco_nd_is_link($value)
{
    return is_string($value) && preg_match('#^(https?://|/(?!/)|tel:|mailto:)#', $value) && !preg_match('/[\s<>"]/', $value);
}

/** @return mixed|null null = ô trống hoặc sai */
function eco_nd_clean_field($field, $value)
{
    switch ($field['kieu']) {
        case 'chu':
            $text = is_string($value) ? trim(sanitize_text_field($value)) : '';
            return $text === '' ? null : mb_substr($text, 0, 4000, 'UTF-8');
        case 'doan':
            $text = is_string($value) ? trim(sanitize_textarea_field($value)) : '';
            return $text === '' ? null : mb_substr($text, 0, 4000, 'UTF-8');
        case 'link':
            $link = is_string($value) ? trim($value) : '';
            if (!eco_nd_is_link($link)) {
                return null;
            }
            if (strpos($link, '/') === 0) {
                return $link; // đường dẫn trong web
            }
            $clean = esc_url_raw($link, array('http', 'https', 'tel', 'mailto'));
            return $clean === '' ? null : $clean;
        case 'so':
            if (is_int($value) || is_float($value)) {
                return $value + 0;
            }
            $text = is_string($value) ? str_replace(',', '.', trim($value)) : '';
            return is_numeric($text) ? (float) $text : null;
        case 'chon':
            $options = isset($field['luaChon']) ? (array) $field['luaChon'] : array();
            return in_array($value, $options, true) ? $value : null;
        case 'chon-nhieu':
            // Giữ thứ tự luaChon, chỉ nhận giá trị có trong danh sách
            $options = isset($field['luaChon']) ? array_values((array) $field['luaChon']) : array();
            $picked = array_map('strval', (array) $value);
            return array_values(array_filter($options, function ($option) use ($picked) {
                return in_array($option, $picked, true);
            }));
        case 'gio':
            return is_string($value) && preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $value) ? $value : null;
        case 'ngay-nghi':
            $days = array();
            foreach ((array) $value as $d) {
                if (is_numeric($d) && (int) $d >= 0 && (int) $d <= 6) {
                    $days[(int) $d] = (int) $d;
                }
            }
            ksort($days);
            return array_values($days);
        case 'ds-anh':
            $list = is_array($value) ? $value : preg_split('/\s+/', (string) $value);
            $out = array();
            foreach ($list as $url) {
                $url = trim((string) $url);
                if ($url !== '' && eco_nd_is_link($url)) {
                    $out[] = $url;
                }
            }
            return array_slice($out, 0, 8);
        case 'doan-nhieu':
        case 'ds-dong':
            // Màn hình sửa gửi một ô chữ: nhiều đoạn cách nhau bằng dòng trống, hoặc mỗi dòng một ý
            $parts = is_array($value) ? $value : preg_split($field['kieu'] === 'doan-nhieu' ? '/\R\s*\R/u' : '/\R/u', (string) $value);
            $out = array();
            foreach ((array) $parts as $part) {
                $text = $field['kieu'] === 'doan-nhieu' ? trim(sanitize_textarea_field((string) $part)) : trim(sanitize_text_field((string) $part));
                if ($text !== '') {
                    $out[] = mb_substr(preg_replace('/\s*\R\s*/u', ' ', $text), 0, 4000, 'UTF-8');
                }
            }
            return array_slice($out, 0, 60);
        case 'ds-cap':
            $keys = isset($field['cap']) ? array_values((array) $field['cap']) : array('a', 'b');
            $lines = is_array($value) ? $value : preg_split('/\R/u', (string) $value);
            $out = array();
            foreach ((array) $lines as $line) {
                if (is_array($line)) {
                    $a = isset($line[$keys[0]]) ? (string) $line[$keys[0]] : '';
                    $b = isset($line[$keys[1]]) ? (string) $line[$keys[1]] : '';
                } else {
                    $split = explode('|', (string) $line, 2);
                    $a = $split[0];
                    $b = isset($split[1]) ? $split[1] : '';
                }
                $a = trim(sanitize_text_field($a));
                $b = trim(sanitize_text_field($b));
                if ($a !== '' && $b !== '') {
                    $out[] = array($keys[0] => mb_substr($a, 0, 4000, 'UTF-8'), $keys[1] => mb_substr($b, 0, 4000, 'UTF-8'));
                }
            }
            return array_slice($out, 0, 60);
        case 'mau':
            $color = is_string($value) ? strtolower(trim($value)) : '';
            return preg_match('/^#[0-9a-f]{6}$/', $color) ? $color : null;
        case 'anh':
            if (!is_array($value) || !isset($value['src']) || !eco_nd_is_link(trim((string) $value['src']))) {
                return null;
            }
            $set = isset($value['srcSet']) ? (string) $value['srcSet'] : '';
            return array(
                'src' => trim((string) $value['src']),
                'srcSet' => preg_match('/[<>"]/', $set) ? '' : trim($set),
                'alt' => isset($value['alt']) ? mb_substr(sanitize_text_field((string) $value['alt']), 0, 300, 'UTF-8') : '',
            );
    }
    return null;
}

function eco_nd_is_empty($value)
{
    return $value === null || $value === '' || $value === array();
}

/**
 * Làm sạch một dòng (hoặc cả bộ "mot") theo các ô. Ô bắt buộc trống: trả null (bỏ dòng / không lưu).
 * $keep_key: ô mã ẩn của dòng (khoaDong) giữ nguyên.
 */
function eco_nd_clean_row($set, $input, &$errors)
{
    $row = array();
    if (!empty($set['khoaDong']) && isset($input[$set['khoaDong']]) && is_string($input[$set['khoaDong']])) {
        $row[$set['khoaDong']] = sanitize_title($input[$set['khoaDong']]);
    }
    foreach ($set['truong'] as $field) {
        $value = eco_nd_clean_field($field, isset($input[$field['khoa']]) ? $input[$field['khoa']] : null);
        if (eco_nd_is_empty($value)) {
            if (!empty($field['batBuoc'])) {
                $errors[] = $field['nhan'];
                return null;
            }
            // Ô không bắt buộc để trống: ghi rỗng để web bỏ ô đó
            $row[$field['khoa']] = in_array($field['kieu'], array('ngay-nghi', 'ds-anh', 'doan-nhieu', 'ds-dong', 'ds-cap', 'chon-nhieu'), true) ? array() : '';
            continue;
        }
        $row[$field['khoa']] = $value;
    }
    return $row;
}

/* ---------------------------------------------------------------- Màu web (src/data/theme.ts) */

/** Độ sáng tương đối WCAG của màu #rrggbb */
function eco_nd_luminance($hex)
{
    $out = 0;
    foreach (array(0.2126, 0.7152, 0.0722) as $i => $weight) {
        $c = hexdec(substr($hex, 1 + $i * 2, 2)) / 255;
        $c = $c <= 0.03928 ? $c / 12.92 : pow(($c + 0.055) / 1.055, 2.4);
        $out += $weight * $c;
    }
    return $out;
}

function eco_nd_contrast($a, $b)
{
    $la = eco_nd_luminance($a);
    $lb = eco_nd_luminance($b);
    return (max($la, $lb) + 0.05) / (min($la, $lb) + 0.05);
}

/** Cặp chữ / nền chưa đủ tương phản (kiemTuongPhan của bộ màu); rỗng là đạt */
function eco_nd_contrast_errors($set, $value)
{
    $errors = array();
    $pick = function ($ref) use ($value) {
        return strpos((string) $ref, '#') === 0 ? (string) $ref : (isset($value[$ref]) ? (string) $value[$ref] : '#000000');
    };
    foreach (isset($set['kiemTuongPhan']) ? (array) $set['kiemTuongPhan'] : array() as $rule) {
        $ratio = eco_nd_contrast($pick($rule['chu']), $pick($rule['nen']));
        if ($ratio + 1e-9 < (float) $rule['toiThieu']) {
            $errors[] = $rule['nhan'] . ' chỉ đạt ' . number_format($ratio, 1, ',', '') . ':1, cần ' . number_format((float) $rule['toiThieu'], 1, ',', '') . ':1';
        }
    }
    return $errors;
}

/** Nội dung mau.css: biến màu của các bộ có `bienCss` đã lưu; rỗng khi chưa đổi màu */
function eco_nd_theme_css()
{
    $lines = array();
    foreach (eco_nd_sets() as $key => $set) {
        if (empty($set['bienCss']) || !eco_nd_saved($key)) {
            continue;
        }
        $value = eco_nd_current($set);
        foreach ((array) $set['bienCss'] as $field => $vars) {
            $hex = isset($value[$field]) ? strtolower((string) $value[$field]) : '';
            if (!preg_match('/^#[0-9a-f]{6}$/', $hex)) {
                continue;
            }
            foreach ((array) $vars as $var) {
                $name = (string) $var['bien'];
                if (!preg_match('/^--[a-z0-9-]+$/', $name)) {
                    continue;
                }
                $color = isset($var['alpha'])
                    ? sprintf('rgb(%d %d %d / %s)', hexdec(substr($hex, 1, 2)), hexdec(substr($hex, 3, 2)), hexdec(substr($hex, 5, 2)), rtrim(rtrim(number_format((float) $var['alpha'], 2, '.', ''), '0'), '.'))
                    : $hex;
                $lines[] = '  ' . $name . ': ' . $color . ';';
            }
        }
    }
    // Kiểu chữ web (theme.ts FONT_SET, đợt E5): font đã chọn nạp từ Google Fonts, ghi biến font và cỡ chữ gốc
    $imports = array();
    $root = '';
    foreach (eco_nd_sets() as $key => $set) {
        if (empty($set['bienFont']) || !eco_nd_saved($key)) {
            continue;
        }
        $value = eco_nd_current($set);
        foreach ((array) $set['bienFont'] as $field => $font) {
            $family = isset($value[$field]) ? (string) $value[$field] : '';
            $options = array();
            foreach ($set['truong'] as $f) {
                if ($f['khoa'] === $field) {
                    $options = isset($f['luaChon']) ? (array) $f['luaChon'] : array();
                }
            }
            $same = isset($set['goc'][$field]) && $set['goc'][$field] === $family;
            if ($same || !in_array($family, $options, true) || !preg_match('/^[A-Za-z ]{2,40}$/', $family)
                || !preg_match('/^--[a-z0-9-]+$/', (string) $font['bien']) || !preg_match('/^[a-z0-9,;@.]{0,60}$/', (string) $font['nap'])
                || preg_match('/[;{}<>]/', (string) $font['duPhong'])) {
                continue;
            }
            $imports[] = "@import url('https://fonts.googleapis.com/css2?family=" . str_replace(' ', '+', $family) . ':' . $font['nap'] . "&display=swap');";
            $lines[] = '  ' . $font['bien'] . ": '" . $family . "', " . $font['duPhong'] . ';';
        }
        $size = !empty($set['oCoChu']) && isset($value[$set['oCoChu']]) ? (string) $value[$set['oCoChu']] : '100';
        if ($size !== '100' && preg_match('/^(9[05]|1[01][05]|100)$/', $size)) {
            $root = "html:root { font-size: " . $size . "%; }\n";
        }
    }
    if (!$lines && $root === '') {
        return "/* Chưa đổi màu, kiểu chữ: dùng bộ gốc */\n";
    }
    return ($imports ? implode("\n", $imports) . "\n" : '')
        . "/* Màu web, kiểu chữ Ecopillo đổi ở Nội dung web, plugin ghi. Không sửa tay. */\n"
        . ($lines ? ":root:root {\n" . implode("\n", $lines) . "\n}\n" : '') . $root;
}

/* ---------------------------------------------------------------- Chuyển hướng link Ecopillo tự thêm (src/data/liveRedirects.ts) */

/** Bảng link cũ → link mới đã kiểm: chỉ link trong web, không trang chủ, không wp-…, không vòng */
function eco_nd_redirects()
{
    $saved = eco_nd_saved('chuyen-huong');
    $map = array();
    foreach ($saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array() as $row) {
        $from = isset($row['tu']) ? strtolower(trailingslashit((string) $row['tu'])) : '';
        $to = isset($row['toi']) ? (string) $row['toi'] : '';
        if (!preg_match('#^/[a-z0-9/_.-]*$#i', $from) || !preg_match('#^/[a-z0-9/_.-]*$#i', $to) || strpos($from, '//') !== false) {
            continue;
        }
        if ($from === '/' || strpos($from, '/wp-') === 0 || $from === strtolower(trailingslashit($to))) {
            continue;
        }
        $map[$from] = $to;
    }
    foreach ($map as $from => $to) {
        if (isset($map[strtolower(trailingslashit($to))])) {
            unset($map[$from]);
        }
    }
    return $map;
}

add_action('template_redirect', 'eco_nd_redirect', -10);
function eco_nd_redirect()
{
    $path = (string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
    $map = eco_nd_redirects();
    $key = strtolower(trailingslashit($path));
    if (!$map || !isset($map[$key])) {
        return;
    }
    wp_safe_redirect(home_url($map[$key]), 301, 'Ecopillo');
    exit;
}

/** Nội dung các bộ đã lưu, để ghi vào du-lieu.js */
function eco_nd_live()
{
    $live = array();
    foreach (eco_nd_sets() as $key => $set) {
        $saved = eco_nd_saved($key);
        if ($saved) {
            $live[$key] = $saved['giaTri'];
        }
    }
    return $live;
}

require_once __DIR__ . '/noi-dung-quan-tri.php';
