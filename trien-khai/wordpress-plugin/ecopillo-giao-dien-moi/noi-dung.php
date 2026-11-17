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
    return $saved ? $saved['giaTri'] : $set['goc'];
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
            $row[$field['khoa']] = in_array($field['kieu'], array('ngay-nghi', 'ds-anh', 'doan-nhieu', 'ds-dong', 'ds-cap'), true) ? array() : '';
            continue;
        }
        $row[$field['khoa']] = $value;
    }
    return $row;
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
