<?php
/**
 * Gỡ sản phẩm, mẫu, bài viết CÓ SẴN của giao diện mới ngay trong WordPress (đợt E2 24/11/2026; owner: "thêm được thì phải sửa
 * được và xoá được, cập nhật được"). Trước đây bỏ vào thùng rác / chuyển nháp trong Woo thì web vẫn hiện (rơi về dữ liệu trong code).
 *
 * Cách Ecopillo gỡ: như mọi web WordPress. Sản phẩm (Woo) hoặc bài viết chuyển sang Bản nháp, Chờ duyệt, Riêng tư, bỏ vào
 * Thùng rác, hoặc Xoá vĩnh viễn. Đăng lại (Đăng / Khôi phục rồi Đăng) là web hiện lại.
 * Chỉ tính thao tác SAU khi cài bản này (ghi lúc trạng thái đổi), để sản phẩm vốn đang nháp trong Woo cũ không tự biến mất khỏi web.
 *
 * Ghi vào du-lieu.js `an` (src/data/liveData.ts): khoá sản phẩm, mẫu, bộ (bộ ẩn / xoá ở danh mục: danh-muc.php), bài; và
 * `trang`: link trang của chúng → trang chuyển tới. Máy chủ trả 301 cho các link đó (trang-wp.php).
 * Sản phẩm, mẫu, bài MỚI (đăng sau lần dựng) không cần ở đây: chúng chỉ hiện khi đang đăng.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** array('product' => [tên link => thời điểm gỡ], 'post' => [...]) */
define('ECO_AX_OPT', 'ecopillo_an_xoa');

/** Tên link gốc của bài / sản phẩm (bỏ đuôi "__trashed" WordPress thêm khi vào thùng rác) */
function eco_ax_slug($post)
{
    $desired = (string) get_post_meta($post->ID, '_wp_desired_post_slug', true);
    $slug = $desired !== '' ? $desired : (string) $post->post_name;
    return preg_replace('/__trashed(-\d+)?$/', '', $slug);
}

function eco_ax_list()
{
    $list = get_option(ECO_AX_OPT, array());
    $list = is_array($list) ? $list : array();
    return array(
        'product' => isset($list['product']) && is_array($list['product']) ? $list['product'] : array(),
        'post' => isset($list['post']) && is_array($list['post']) ? $list['post'] : array(),
    );
}

function eco_ax_set($type, $slug, $hidden)
{
    if (!preg_match('/^[a-z0-9-]{1,200}$/', $slug)) {
        return;
    }
    $list = eco_ax_list();
    if ($hidden) {
        $list[$type][$slug] = time();
    } elseif (isset($list[$type][$slug])) {
        unset($list[$type][$slug]);
    } else {
        return;
    }
    update_option(ECO_AX_OPT, $list, false);
    eco_gia_mark_dirty();
}

/** Đổi trạng thái: rời "Đã đăng" (nháp, chờ duyệt, riêng tư, thùng rác) → gỡ; đăng lại → hiện lại */
add_action('transition_post_status', function ($new, $old, $post) {
    if (!is_object($post) || !in_array($post->post_type, array('product', 'post'), true) || $new === $old || $new === 'auto-draft' || $new === 'inherit') {
        return;
    }
    if ($new === 'publish') {
        eco_ax_set($post->post_type, eco_ax_slug($post), false);
    } elseif ($old === 'publish' || $new === 'trash') {
        eco_ax_set($post->post_type, eco_ax_slug($post), true);
    }
}, 10, 3);

/** Xoá vĩnh viễn */
add_action('before_delete_post', function ($post_id) {
    $post = get_post($post_id);
    if ($post && in_array($post->post_type, array('product', 'post'), true)) {
        eco_ax_set($post->post_type, eco_ax_slug($post), true);
    }
});

/** Bài viết đang đăng theo tên link */
function eco_ax_post_published($slug)
{
    $post = get_page_by_path($slug, OBJECT, 'post');
    return $post && $post->post_status === 'publish';
}

/**
 * @return array{sanPham: string[], mau: string[], bo: string[], bai: string[], trang: array<string, string>, rows: array}
 */
function eco_ax_compute()
{
    $result = array('sanPham' => array(), 'mau' => array(), 'bo' => array(), 'bai' => array(), 'trang' => array(), 'rows' => array());
    $frame = eco_gia_frame();
    $list = eco_ax_list();
    $default = isset($frame['trangSanPham']) ? (string) $frame['trangSanPham'] : '/';
    $collection_pages = array();
    foreach (isset($frame['boSuuTap']) ? (array) $frame['boSuuTap'] : array() as $col) {
        $collection_pages[(string) $col['id']] = (string) $col['trang'];
    }
    if ($list['product'] && function_exists('wc_get_product')) {
        $hidden_of = function ($item) use ($list) {
            $woo = (array) $item['woo'];
            // Gỡ một tên link nào đó của sản phẩm, và không còn tên nào đang đăng
            return array_intersect_key(array_flip($woo), $list['product']) && !eco_gia_find_product($woo);
        };
        foreach (isset($frame['sanPham']) ? (array) $frame['sanPham'] : array() as $item) {
            if (!$hidden_of($item)) {
                continue;
            }
            $target = !empty($item['veTrang']) ? (string) $item['veTrang'] : $default;
            $result['sanPham'][] = (string) $item['khoa'];
            $result['trang'][(string) $item['duongDan']] = $target;
            $result['rows'][] = array('ten' => (string) $item['ten'], 'loai' => 'Sản phẩm', 'trang' => (string) $item['duongDan'], 'toi' => $target);
        }
        foreach (isset($frame['mau']) ? (array) $frame['mau'] : array() as $item) {
            if (!$hidden_of($item)) {
                continue;
            }
            $bo = strtok((string) $item['khoa'], '/');
            $target = isset($collection_pages[$bo]) ? $collection_pages[$bo] : $default;
            $result['mau'][] = (string) $item['khoa'];
            $result['trang'][(string) $item['duongDan']] = $target;
            $result['rows'][] = array('ten' => (string) $item['ten'], 'loai' => 'Mẫu', 'trang' => (string) $item['duongDan'], 'toi' => $target);
        }
    }
    // Bộ sưu tập có sẵn Ecopillo ẩn / xoá ở trang danh mục Woo (danh-muc.php)
    $categories_hidden = function_exists('eco_dm_compute') ? eco_dm_compute()['an'] : array();
    foreach ($collection_pages as $id => $path) {
        if (isset($categories_hidden[$path])) {
            $result['bo'][] = $id;
        }
    }
    // Trang từng mẫu của bộ đã ẩn: chuyển cùng chỗ với trang bộ
    foreach (isset($frame['mau']) ? (array) $frame['mau'] : array() as $item) {
        $bo = strtok((string) $item['khoa'], '/');
        if (in_array($bo, $result['bo'], true) && !isset($result['trang'][(string) $item['duongDan']])) {
            $result['trang'][(string) $item['duongDan']] = $categories_hidden[$collection_pages[$bo]];
        }
    }
    // Bài viết có sẵn lúc dựng
    $built = isset($frame['baiViet']) ? (array) $frame['baiViet'] : array();
    $blog = isset($frame['trangTinTuc']) ? (string) $frame['trangTinTuc'] : '/';
    foreach (array_keys($list['post']) as $slug) {
        if (!isset($built[$slug]) || eco_ax_post_published($slug)) {
            continue;
        }
        $result['bai'][] = $slug;
        $result['trang']['/' . $slug . '/'] = $blog;
        $result['rows'][] = array('ten' => $slug, 'loai' => 'Bài viết', 'trang' => '/' . $slug . '/', 'toi' => $blog);
    }
    return $result;
}

/** Bảng ở trang "Giá trên web" */
function eco_ax_admin_section()
{
    $rows = eco_ax_compute()['rows'];
    ?>
    <h2>Sản phẩm, mẫu, bài viết đã gỡ khỏi giao diện mới</h2>
    <p>Gỡ: chuyển sản phẩm / bài sang Bản nháp, Riêng tư, Thùng rác hoặc xoá vĩnh viễn. Link trang chuyển (301) tới trang ghi dưới đây.
        Hiện lại: Đăng lại (thùng rác → Khôi phục → Đăng).</p>
    <?php if (!$rows) : ?>
        <p style="color:#555">Chưa gỡ gì.</p>
    <?php else : ?>
        <table class="widefat striped" style="margin-bottom:24px"><thead><tr><th>Loại</th><th>Tên</th><th>Link</th><th>Chuyển tới</th></tr></thead><tbody>
        <?php foreach ($rows as $r) : ?>
            <tr><td><?php echo esc_html($r['loai']); ?></td><td><?php echo esc_html($r['ten']); ?></td>
                <td><code><?php echo esc_html($r['trang']); ?></code></td><td><code><?php echo esc_html($r['toi']); ?></code></td></tr>
        <?php endforeach; ?>
        </tbody></table>
    <?php endif;
}
