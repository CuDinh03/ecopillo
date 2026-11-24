<?php
/**
 * Bài viết Ecopillo đăng mới hoặc sửa trong WordPress sau lần dựng web (giai đoạn 4b, docs/ke-hoach-khach-tu-sua-du-lieu.md).
 * Anh Quang 18/11/2026: "thêm sp mới và bài viết mới là nhiệm vụ của bên anh".
 *
 * Bài lúc dựng nằm sẵn trong giao diện (src/data/bai-viet-wp/). Plugin so với khung-gia.json (`baiViet`: tên bài → ngày sửa):
 * - bài đã đăng mà web chưa có, hoặc sửa sau ngày đó → ghi danh sách vào du-lieu.js (`window.__ECO_BAI__`, src/data/livePosts.ts)
 *   và thân bài vào uploads/ecopillo-du-lieu/bai/<tên>.json (WordPressBody.tsx nạp khi mở bài);
 * - link /<tên bài>/ của bài mới: trả trang khung giao diện mới (eco_mm_shell). Bài đã có trang dựng sẵn thì .htaccess phục vụ
 *   trang đó, web tự thay thân bài bằng bản mới.
 * Thân bài: bỏ script, style, iframe…; wp_kses chỉ giữ thẻ đọc được; ảnh có chữ chất liệu cũ trong tên file bị bỏ; chữ đó đổi thành
 * Lyocell (CLAUDE.md). Trình duyệt lọc lại một lần nữa (src/lib/cleanPostHtml.ts, cùng danh sách thẻ).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_BV_OPT_TRANG', 'ecopillo_bai_moi_trang');
/** Danh mục "Tin tức" trên WordPress (id 30), như tools/lay-bai-viet-wordpress.mjs; bài khác ghi "Cẩm nang" */
define('ECO_BV_TIN_TUC', 30);
/** Ô "Mục trên web" khi soạn bài (owner 18/11/2026): mã → chữ, khớp SECTION_LABELS ở src/data/postSections.ts */
define('ECO_BV_MUC_META', '_eco_muc_web');
function eco_bv_muc_options()
{
    return array(
        'tin-tuc' => 'Tin tức (tin về Ecopillo)',
        'chon-chan-ga' => 'Cẩm nang · Chọn chăn ga gối đệm',
        'giac-ngu' => 'Cẩm nang · Giấc ngủ và sức khoẻ',
        'phong-ngu' => 'Cẩm nang · Phòng ngủ và phong thuỷ',
        'cuoi-hoi-le-tet' => 'Cẩm nang · Cưới hỏi, lễ tết',
    );
}

/** Thẻ, thuộc tính được giữ trong thân bài (khớp ALLOWED, ATTRS ở src/lib/cleanPostHtml.ts) */
function eco_bv_allowed_html()
{
    $plain = array();
    foreach (array('p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'figure', 'figcaption', 'blockquote', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'br', 'hr', 'sub', 'sup') as $tag) {
        $plain[$tag] = array();
    }
    return array_merge($plain, array(
        'h2' => array('id' => true), 'h3' => array('id' => true), 'h4' => array('id' => true),
        'a' => array('href' => true),
        'img' => array('src' => true, 'alt' => true, 'width' => true, 'height' => true, 'srcset' => true, 'sizes' => true),
        'td' => array('colspan' => true, 'rowspan' => true), 'th' => array('colspan' => true, 'rowspan' => true, 'scope' => true),
        'nav' => array('aria-label' => true),
    ));
}

/** Thân bài sạch từ HTML WordPress đã chạy bộ lọc the_content */
function eco_bv_body($html)
{
    $html = preg_replace('#<(script|style|iframe|object|embed|form|noscript|svg|canvas|video|audio|button|select|textarea|template)\b[^>]*>.*?</\1\s*>#is', '', (string) $html);
    $html = preg_replace('#<(/?)h1\b#i', '<$1h2', $html);
    $html = preg_replace('#<(/?)h[56]\b#i', '<$1h4', $html);
    // Ảnh có chữ chất liệu cũ trong tên file: bỏ (web mới không dùng tên file có chữ đó)
    $html = preg_replace_callback('#<img\b[^>]*>#i', function ($m) {
        return preg_match('/\b(src|srcset)\s*=\s*"[^"]*(tencel|60s)[^"]*"/i', $m[0]) ? '' : $m[0];
    }, $html);
    $html = wp_kses($html, eco_bv_allowed_html());
    $html = preg_replace('/tencel\s*(™|®|&trade;|&reg;)?/i', 'Lyocell', $html);
    $html = preg_replace('/\s*\b60\s?s\b/i', '', $html);
    return trim($html);
}

/**
 * Bài mới / đã sửa. @return array{live: array, bodies: array, pages: array}
 */
function eco_bv_compute()
{
    $result = array('live' => array(), 'bodies' => array(), 'pages' => array());
    $frame = eco_gia_frame();
    $built = isset($frame['baiViet']) && is_array($frame['baiViet']) ? $frame['baiViet'] : array();
    $code = isset($frame['baiTrongCode']) ? array_flip((array) $frame['baiTrongCode']) : array();
    $shell = isset($frame['khungBai']) ? (string) $frame['khungBai'] : '';
    if ($shell === '') {
        return $result;
    }
    $posts = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 200, 'orderby' => 'date', 'order' => 'DESC'));
    foreach ($posts as $post) {
        $slug = (string) $post->post_name;
        if (isset($code[$slug]) || !preg_match('/^[a-z0-9-]{3,200}$/', $slug) || preg_match('/tencel|60s/', $slug)) {
            continue;
        }
        $modified = get_post_modified_time('Y-m-d', false, $post);
        // Bài đã có lúc dựng, chưa sửa. Khung chỉ ghi ngày (không giờ): bài sửa đúng ngày dựng vẫn coi là đã sửa (đợt E2),
        // trước đây so "<=" nên sửa cùng ngày bị bỏ qua
        if (isset($built[$slug]) && (string) $modified < (string) $built[$slug]) {
            continue;
        }
        $GLOBALS['post'] = $post;
        setup_postdata($post);
        $body = eco_bv_body(apply_filters('the_content', $post->post_content));
        wp_reset_postdata();
        $title = eco_sp_text(get_the_title($post), 200);
        if ($title === '' || $body === '') {
            continue;
        }
        $excerpt = has_excerpt($post)
            ? $post->post_excerpt
            : wp_trim_words(wp_strip_all_tags(strip_shortcodes($post->post_content)), 55, '…');
        $excerpt = eco_sp_text($excerpt, 400);
        $yoast = eco_sp_text(get_post_meta($post->ID, '_yoast_wpseo_metadesc', true), 160);
        $words = count(preg_split('/\s+/u', trim(wp_strip_all_tags($body)), -1, PREG_SPLIT_NO_EMPTY));
        $cover = eco_sp_image(get_post_thumbnail_id($post));
        $muc = (string) get_post_meta($post->ID, ECO_BV_MUC_META, true);
        $result['live'][] = array(
            'duongDan' => $slug,
            'tieuDe' => $title,
            'tomTat' => $excerpt,
            'moTa' => mb_strlen($yoast, 'UTF-8') >= 50 ? $yoast : mb_substr($excerpt, 0, 155, 'UTF-8'),
            'loai' => has_category(ECO_BV_TIN_TUC, $post) ? 'Tin tức' : 'Cẩm nang',
            'muc' => isset(eco_bv_muc_options()[$muc]) ? $muc : '',
            'ngay' => get_the_date('Y-m-d', $post),
            'sua' => $modified,
            'phut' => max(1, (int) round($words / 220)),
            'anh' => $cover ? $cover : null,
        );
        $result['bodies'][$slug] = $body;
        if (!isset($built[$slug])) {
            $result['pages'][$slug] = array('khung' => $shell, 'tieuDe' => $title, 'anh' => $cover ? $cover['src'] : '', 'url' => '/' . $slug . '/');
        }
    }
    return $result;
}

/** Ghi thân bài: mỗi bài một file; bài không còn trong danh sách thì xoá file */
function eco_bv_write_bodies($bodies)
{
    $dir = eco_gia_dir() . '/bai';
    if (!wp_mkdir_p($dir)) {
        return;
    }
    $keep = array();
    foreach ($bodies as $slug => $html) {
        $keep[$slug . '.json'] = true;
        file_put_contents($dir . '/' . $slug . '.json', wp_json_encode(array('html' => $html)));
    }
    foreach ((array) glob($dir . '/*.json') as $file) {
        if (!isset($keep[basename($file)])) {
            @unlink($file);
        }
    }
}

/* ---------------------------------------------------------------- Ghi lại khi Ecopillo đăng, sửa, gỡ bài */

add_action('save_post_post', 'eco_gia_mark_dirty');
add_action('trashed_post', 'eco_bv_mark_post');
add_action('untrashed_post', 'eco_bv_mark_post');
function eco_bv_mark_post($post_id)
{
    if (get_post_type($post_id) === 'post') {
        eco_gia_mark_dirty();
    }
}

/* ---------------------------------------------------------------- Trang khung cho link bài mới */

add_action('template_redirect', 'eco_bv_serve', 0);
function eco_bv_serve()
{
    $path = (string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
    if (!preg_match('#^/([a-z0-9-]+)/?$#', $path, $m) || !eco_mm_visitor_sees_new()) {
        return;
    }
    $pages = get_option(ECO_BV_OPT_TRANG, array());
    if (!is_array($pages) || !isset($pages[$m[1]])) {
        return;
    }
    $page = $pages[$m[1]];
    $file = __DIR__ . '/site' . $page['khung'] . 'index.html';
    $html = is_readable($file) ? (string) file_get_contents($file) : '';
    if ($html === '') {
        return;
    }
    echo eco_mm_shell($html, $m[1], $page); // trang tĩnh của giao diện mới, các chữ chèn vào đã thoát
    exit;
}

/* ---------------------------------------------------------------- Ô "Mục trên web" khi soạn bài */

add_action('add_meta_boxes_post', 'eco_bv_muc_box');
function eco_bv_muc_box()
{
    add_meta_box('eco-muc-web', 'Mục trên web', 'eco_bv_muc_box_html', 'post', 'side', 'high');
}

function eco_bv_muc_box_html($post)
{
    wp_nonce_field('eco_bv_muc_luu', 'eco_bv_muc_nonce');
    $current = (string) get_post_meta($post->ID, ECO_BV_MUC_META, true);
    echo '<p style="margin-top:0">Bài hiện ở nhóm này trên trang Tin tức của web.</p>';
    foreach (eco_bv_muc_options() as $value => $label) {
        echo '<label style="display:block;margin:6px 0"><input type="radio" name="eco_muc_web" value="' . esc_attr($value) . '"' . checked($current, $value, false) . '> ' . esc_html($label) . '</label>';
    }
    echo '<label style="display:block;margin:6px 0;color:#646970"><input type="radio" name="eco_muc_web" value=""' . checked($current, '', false) . '> Để web tự xếp</label>';
    echo '<p class="description">Tin tức: tin về chính Ecopillo (khai trương, giải thưởng, chương trình, sự kiện). Cẩm nang: bài kiến thức. "Để web tự xếp": bài cũ giữ nhóm đã duyệt, bài mới theo chuyên mục WordPress.</p>';
}

add_action('save_post_post', 'eco_bv_muc_save', 5);
function eco_bv_muc_save($post_id)
{
    if (!isset($_POST['eco_bv_muc_nonce']) || !wp_verify_nonce(sanitize_key(wp_unslash($_POST['eco_bv_muc_nonce'])), 'eco_bv_muc_luu')) {
        return;
    }
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) {
        return;
    }
    $value = isset($_POST['eco_muc_web']) ? sanitize_key(wp_unslash($_POST['eco_muc_web'])) : '';
    if (isset(eco_bv_muc_options()[$value])) {
        update_post_meta($post_id, ECO_BV_MUC_META, $value);
    } else {
        delete_post_meta($post_id, ECO_BV_MUC_META);
    }
}
