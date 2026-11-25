<?php
/**
 * Trang mới Ecopillo tự tạo (đợt G 24/11/2026; owner: "khách phải 100% tự sửa được tất cả những gì có ở web"): một Trang
 * WordPress (Trang → Thêm mới) có tích "Hiện trang này bằng giao diện mới" hiện ở đúng link của nó bằng giao diện mới, khung
 * như một bài viết (tiêu đề, ảnh đại diện, nội dung), không nằm trong danh sách Tin tức. Đưa lên menu: Nội dung web → Menu chính.
 *
 * Dùng chung đường đi của bài viết mới (bai-viet-moi.php): thân trang lọc bằng eco_bv_body, ghi bai/<tên>.json, mục trong
 * `window.__ECO_BAI__` có `trang: true` (src/data/livePosts.ts), trang khung do eco_bv_serve trả. Trang của web WordPress cũ
 * không tích thì không đổi gì. Gỡ: bỏ tích, chuyển nháp hoặc bỏ thùng rác.
 *
 * Kiểu trang (đợt I 24/11/2026, owner: "thêm được thì phải sửa được và xoá được"): "Trang chính sách" hiện trong khung các trang
 * chính sách (menu chính sách bên trái, ArticlePage → PolicyLayout), mục trong `window.__ECO_BAI__` có `kieu: 'chinh-sach'`.
 * Đưa lên menu chính sách: Nội dung web → Trang chính sách → "Menu chính sách: các trang".
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_TM_META', '_eco_trang_giao_dien_moi');
/** Kiểu trang: không có = trang thường (khung bài viết); 'chinh-sach' = khung trang chính sách */
define('ECO_TM_KIEU_META', '_eco_trang_kieu');

add_action('add_meta_boxes_page', function () {
    add_meta_box('eco-trang-moi', 'Giao diện mới', 'eco_tm_box', 'page', 'side', 'high');
});

function eco_tm_box($post)
{
    wp_nonce_field('eco_tm_luu', 'eco_tm_nonce');
    $on = get_post_meta($post->ID, ECO_TM_META, true) === '1';
    $kind = eco_tm_kind($post->ID);
    $problem = $on ? eco_tm_problem($post) : '';
    ?>
    <p><label><input type="checkbox" name="eco_tm_bat" value="1" <?php checked($on); ?>>
        <strong>Hiện trang này bằng giao diện mới</strong></label></p>
    <p style="color:#555;margin:0">Trang hiện ở đúng link của nó (đường dẫn không dấu, một cấp, ví dụ <code>/uu-dai-thang-12/</code>), kiểu như một bài viết:
        tiêu đề, ảnh đại diện, nội dung. Đưa lên thanh đầu trang: Nội dung web → Menu chính, thêm dòng với link này. Bỏ tích hoặc chuyển nháp là gỡ.</p>
    <p style="margin:12px 0 4px"><label for="eco-tm-kieu"><strong>Kiểu trang</strong></label></p>
    <select id="eco-tm-kieu" name="eco_tm_kieu" style="width:100%">
        <option value="" <?php selected($kind, ''); ?>>Trang thường (như một bài viết)</option>
        <option value="chinh-sach" <?php selected($kind, 'chinh-sach'); ?>>Trang chính sách</option>
    </select>
    <p style="color:#555;margin:4px 0 0">Trang chính sách: hiện trong khung các trang chính sách (menu chính sách bên trái, tiêu đề, đoạn tóm tắt làm đoạn mở đầu).
        Đưa vào menu chính sách: Nội dung web → Trang chính sách → Menu chính sách: các trang, thêm dòng với link này.</p>
    <?php if ($problem !== '') : ?>
        <p style="color:#b32d2e;font-weight:600;margin-top:8px">Chưa hiện: <?php echo esc_html($problem); ?></p>
    <?php endif;
}

add_action('save_post_page', function ($post_id) {
    if (!isset($_POST['eco_tm_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eco_tm_nonce'])), 'eco_tm_luu')) {
        return;
    }
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || !current_user_can('edit_page', $post_id)) {
        return;
    }
    $was = get_post_meta($post_id, ECO_TM_META, true) === '1';
    $on = isset($_POST['eco_tm_bat']) && $_POST['eco_tm_bat'] === '1';
    if ($on) {
        update_post_meta($post_id, ECO_TM_META, '1');
    } else {
        delete_post_meta($post_id, ECO_TM_META);
    }
    // Kiểu trang: đổi kiểu cũng ghi lại (dòng dưới ghi khi trang đang / vừa tích)
    $kind = isset($_POST['eco_tm_kieu']) ? sanitize_key(wp_unslash($_POST['eco_tm_kieu'])) : '';
    if ($kind === 'chinh-sach') {
        update_post_meta($post_id, ECO_TM_KIEU_META, 'chinh-sach');
    } else {
        delete_post_meta($post_id, ECO_TM_KIEU_META);
    }
    if ($on || $was) {
        eco_gia_mark_dirty();
    }
});

/** Trang đã tích đổi trạng thái (thùng rác, khôi phục): ghi lại */
foreach (array('trashed_post', 'untrashed_post', 'deleted_post') as $eco_tm_hook) {
    add_action($eco_tm_hook, function ($post_id) {
        if (get_post_type($post_id) === 'page' && get_post_meta($post_id, ECO_TM_META, true) === '1') {
            eco_gia_mark_dirty();
        }
    });
}

/** Kiểu trang đã chọn: '' (trang thường) hoặc 'chinh-sach' */
function eco_tm_kind($post_id)
{
    return get_post_meta($post_id, ECO_TM_KIEU_META, true) === 'chinh-sach' ? 'chinh-sach' : '';
}

/** Lý do trang đã tích chưa hiện được (rỗng = hiện được) */
function eco_tm_problem($post)
{
    if ($post->post_status !== 'publish') {
        return 'trang chưa ở trạng thái Đã đăng';
    }
    $path = trailingslashit((string) parse_url((string) get_permalink($post), PHP_URL_PATH));
    if (!preg_match('#^/([a-z0-9-]{3,200})/$#', $path, $m) || preg_match('/tencel|60s/', $path)) {
        return 'đường dẫn phải không dấu, một cấp (không đặt trang mẹ), không có chữ chất liệu cũ';
    }
    if (function_exists('eco_tw_static_file') && eco_tw_static_file($path) !== '') {
        return 'link trùng một trang có sẵn của web, đổi đường dẫn khác';
    }
    $frame = eco_gia_frame();
    $built = isset($frame['baiViet']) ? (array) $frame['baiViet'] : array();
    $code = isset($frame['baiTrongCode']) ? array_flip((array) $frame['baiTrongCode']) : array();
    if (isset($built[$m[1]]) || isset($code[$m[1]]) || get_page_by_path($m[1], OBJECT, 'post')) {
        return 'link trùng một bài viết, đổi đường dẫn khác';
    }
    return '';
}

/** @return array{live: array, bodies: array, pages: array} cùng dạng eco_bv_compute */
function eco_tm_compute()
{
    $result = array('live' => array(), 'bodies' => array(), 'pages' => array());
    $frame = eco_gia_frame();
    $shell = isset($frame['khungBai']) ? (string) $frame['khungBai'] : '';
    if ($shell === '' || !function_exists('eco_bv_body')) {
        return $result;
    }
    $pages = get_posts(array(
        'post_type' => 'page', 'post_status' => 'publish', 'numberposts' => 100,
        'meta_key' => ECO_TM_META, 'meta_value' => '1',
    ));
    foreach ($pages as $page) {
        if (eco_tm_problem($page) !== '') {
            continue;
        }
        $slug = (string) $page->post_name;
        $GLOBALS['post'] = $page;
        setup_postdata($page);
        $body = eco_bv_body(apply_filters('the_content', $page->post_content));
        wp_reset_postdata();
        $title = eco_sp_text(get_the_title($page), 200);
        if ($title === '' || $body === '') {
            continue;
        }
        $excerpt = eco_sp_text(has_excerpt($page) ? $page->post_excerpt : wp_trim_words(wp_strip_all_tags(strip_shortcodes($page->post_content)), 40, '…'), 400);
        $yoast = eco_sp_text(get_post_meta($page->ID, '_yoast_wpseo_metadesc', true), 160);
        $words = count(preg_split('/\s+/u', trim(wp_strip_all_tags($body)), -1, PREG_SPLIT_NO_EMPTY));
        $cover = eco_sp_image(get_post_thumbnail_id($page));
        $desc = mb_strlen($yoast, 'UTF-8') >= 50 ? $yoast : mb_substr($excerpt, 0, 155, 'UTF-8');
        $result['live'][] = array(
            'duongDan' => $slug, 'tieuDe' => $title, 'tomTat' => $excerpt,
            'moTa' => $desc,
            'loai' => 'Cẩm nang', 'muc' => '', 'trang' => true, 'kieu' => eco_tm_kind($page->ID),
            'ngay' => get_the_date('Y-m-d', $page), 'sua' => get_post_modified_time('Y-m-d', false, $page),
            'phut' => max(1, (int) round($words / 220)), 'anh' => $cover ? $cover : null,
        );
        $result['bodies'][$slug] = $body;
        $result['pages'][$slug] = array('khung' => $shell, 'tieuDe' => $title, 'moTa' => $desc, 'anh' => $cover ? $cover['src'] : '', 'url' => '/' . $slug . '/');
    }
    return $result;
}
