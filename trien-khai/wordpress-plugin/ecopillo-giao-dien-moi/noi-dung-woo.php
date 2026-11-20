<?php
/**
 * Sản phẩm có sẵn trên web lấy tên, ảnh, mô tả từ WooCommerce (đợt B, docs/ke-hoach-khach-tu-sua-du-lieu.md mục 5;
 * owner 20/11/2026: "đảm bảo tất cả mọi thứ trên web, khách đều tự chỉnh sửa được").
 *
 * Nội dung trong Woo hiện là bản web cũ (chữ chất liệu cũ, "bạn", ảnh cũ), nên mặc định web giữ nội dung của giao diện.
 * Ecopillo soát xong một sản phẩm thì tích ô "Giao diện mới dùng tên, ảnh, mô tả của sản phẩm này" trong trang sửa sản phẩm.
 * Từ đó plugin ghi phần đó vào du-lieu.js (`window.__ECO_GIA__.noiDungWoo`, src/data/liveData.ts):
 * - sản phẩm lẻ (đệm, gối, chăn…): tên, ảnh, ảnh thư viện, mô tả ngắn, mô tả (các ý), thuộc tính hiện ra (thông số);
 * - mẫu của bộ chăn ga: ảnh, ảnh thư viện, tên màu (dòng đầu Mô tả ngắn, như mẫu mới ở mau-moi.php), câu chuyện (ô Mô tả,
 *   dòng đầu là tên câu chuyện; thuộc tính "Gam màu"; đợt C, bo-suu-tap-moi.php).
 * Ô nào trong Woo để trống thì web giữ nội dung có sẵn của ô đó. Không phụ thuộc việc bật lấy giá từ Woo.
 * Sản phẩm web ↔ sản phẩm Woo ghép theo link như khung giá (khung-gia.json: `noiDung`, `mau`).
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_NW_META', '_eco_giao_dien_dung_woo');
define('ECO_NW_META_HIEU_KY', '_eco_hieu_ky');

/** Mục sản phẩm lẻ trong khung giá (khung-gia.json `noiDung`) ứng với sản phẩm Woo này (theo link), không có thì null */
function eco_nw_frame_item($product)
{
    $slug = $product->get_slug();
    foreach (isset(eco_gia_frame()['noiDung']) ? (array) eco_gia_frame()['noiDung'] : array() as $item) {
        if (in_array($slug, (array) $item['woo'], true)) {
            return $item;
        }
    }
    return null;
}

/** Chữ so sánh: bỏ khoảng trắng thừa, dòng trống */
function eco_nw_norm($text)
{
    return trim(preg_replace('/[ \t]+/', ' ', preg_replace('/\R\s*\R/u', "\n", str_replace("\r", '', (string) $text))));
}

/* ---------------------------------------------------------------- Ô tích trong trang sửa sản phẩm */

add_action('add_meta_boxes_product', 'eco_nw_add_box');
function eco_nw_add_box()
{
    add_meta_box('eco-dung-woo', 'Giao diện mới', 'eco_nw_box', 'product', 'side', 'high');
}

function eco_nw_box($post)
{
    wp_nonce_field('eco_nw_luu', 'eco_nw_nonce');
    $checked = get_post_meta($post->ID, ECO_NW_META, true) === '1';
    ?>
    <p><label><input type="checkbox" name="eco_nw_dung" value="1" <?php checked($checked); ?>>
        <strong>Giao diện mới dùng tên, ảnh, mô tả của sản phẩm này</strong></label></p>
    <p style="color:#555;margin:0">Tích khi đã soát xong: tên, ảnh sản phẩm, ảnh thư viện, mô tả ngắn, mô tả, thuộc tính.
        Bộ chăn ga: ảnh, ảnh thư viện, tên màu (dòng đầu Mô tả ngắn), câu chuyện (Mô tả: dòng đầu là tên câu chuyện; thuộc tính Gam màu). Ô nào để trống thì web giữ nội dung đang có.
        Không tích: web giữ nội dung của giao diện mới. Sản phẩm mới đăng (chưa có trên web) thì không cần tích.</p>
    <?php
    $product = wc_get_product($post->ID);
    $item = $product ? eco_nw_frame_item($product) : null;
    if (!$item) {
        return;
    }
    $saved = (string) get_post_meta($post->ID, ECO_NW_META_HIEU_KY, true);
    $text = $saved !== '' ? $saved : (string) $item['hieuKy'];
    ?>
    <hr>
    <p><label for="eco_nw_hieu_ky"><strong>Hiểu kỹ trước khi chọn</strong></label></p>
    <textarea name="eco_nw_hieu_ky" id="eco_nw_hieu_ky" rows="12" style="width:100%;font-size:12px"><?php echo esc_textarea($text); ?></textarea>
    <p style="color:#555;margin:0">Phần dài cuối trang sản phẩm. Dòng bắt đầu bằng <code>## </code> là tên phần, dòng bắt đầu bằng <code>- </code> là một ý gạch đầu dòng,
        dòng khác là đoạn văn. Đang điền sẵn chữ trên web; sửa rồi bấm Cập nhật là web đổi (không cần tích ô trên). Xoá trắng ô là bỏ hẳn phần này.</p>
    <?php
}

add_action('save_post_product', 'eco_nw_save', 10, 2);
function eco_nw_save($post_id, $post)
{
    if (!isset($_POST['eco_nw_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eco_nw_nonce'])), 'eco_nw_luu')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE || wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) {
        return;
    }
    $on = isset($_POST['eco_nw_dung']) && $_POST['eco_nw_dung'] === '1';
    $was = get_post_meta($post_id, ECO_NW_META, true) === '1';
    // "Hiểu kỹ trước khi chọn": giữ nguyên chữ gốc thì không lưu (web dùng bản trong giao diện); xoá trắng là bỏ phần này
    if (isset($_POST['eco_nw_hieu_ky'])) {
        $product = wc_get_product($post_id);
        $item = $product ? eco_nw_frame_item($product) : null;
        $text = mb_substr(sanitize_textarea_field(wp_unslash($_POST['eco_nw_hieu_ky'])), 0, 12000, 'UTF-8');
        $before = (string) get_post_meta($post_id, ECO_NW_META_HIEU_KY, true);
        if ($item && eco_nw_norm($text) === eco_nw_norm($item['hieuKy'])) {
            delete_post_meta($post_id, ECO_NW_META_HIEU_KY);
        } else {
            update_post_meta($post_id, ECO_NW_META_HIEU_KY, trim($text) === '' ? '-' : $text);
        }
        if ($before !== (string) get_post_meta($post_id, ECO_NW_META_HIEU_KY, true)) {
            eco_gia_mark_dirty();
        }
    }
    if ($on) {
        update_post_meta($post_id, ECO_NW_META, '1');
    } else {
        delete_post_meta($post_id, ECO_NW_META);
    }
    if ($on || $was) {
        eco_gia_mark_dirty();
    }
}

/* ---------------------------------------------------------------- Đọc nội dung từ Woo */

/** Ảnh từ Thư viện; tên file có chữ chất liệu cũ thì bỏ (CLAUDE.md: không dùng chữ đó cả trong tên file ảnh) */
function eco_nw_image($attachment_id)
{
    $img = eco_sp_image($attachment_id);
    return ($img && !preg_match('/tencel|60-?s\b/i', $img['src'])) ? $img : null;
}

/** Ảnh thư viện sản phẩm (tối đa 12) */
function eco_nw_gallery($product)
{
    $gallery = array();
    foreach ($product->get_gallery_image_ids() as $id) {
        $img = eco_nw_image($id);
        if ($img) {
            $gallery[] = $img;
        }
    }
    return array_slice($gallery, 0, 12);
}

/** Phần nội dung của một sản phẩm lẻ: chỉ các ô có chữ / ảnh */
function eco_nw_product_entry($product)
{
    $entry = array(
        'ten' => eco_sp_text($product->get_name(), 120),
        'anh' => eco_nw_image($product->get_image_id()),
        'anhPhu' => eco_nw_gallery($product),
        'tomTat' => eco_sp_text($product->get_short_description(), 400),
        'chiTiet' => eco_sp_points($product->get_description()),
        'thongSo' => eco_sp_specs($product),
    );
    return array_filter($entry, function ($v) {
        return $v !== '' && $v !== null && $v !== array();
    });
}

/** Phần nội dung của một mẫu chăn ga: ảnh, ảnh thư viện, tên màu (dòng đầu Mô tả ngắn, tối đa 60 chữ cái) */
function eco_nw_pattern_entry($product)
{
    $short = eco_sp_text(strtok(wp_strip_all_tags((string) $product->get_short_description()) . "\n", "\r\n"), 200);
    $entry = array(
        'anh' => eco_nw_image($product->get_image_id()),
        'anhPhu' => eco_nw_gallery($product),
        'tenMau' => mb_strlen($short, 'UTF-8') <= 60 ? $short : '',
        'cauChuyen' => function_exists('eco_bst_story') ? eco_bst_story($product) : null,
    );
    return array_filter($entry, function ($v) {
        return $v !== '' && $v !== null && $v !== array();
    });
}

/**
 * @return array{live: array{sanPham: array, mau: array}, rows: array}
 * rows: bảng cho trang "Giá trên web" (mọi sản phẩm, mẫu có trang riêng trên web)
 */
function eco_nw_compute()
{
    $result = array('live' => array('sanPham' => array(), 'mau' => array()), 'rows' => array());
    if (!function_exists('wc_get_product')) {
        return $result;
    }
    $frame = eco_gia_frame();
    $groups = array(
        array('sanPham', isset($frame['noiDung']) ? (array) $frame['noiDung'] : array(), 'eco_nw_product_entry', 'Sản phẩm lẻ'),
        array('mau', isset($frame['mau']) ? (array) $frame['mau'] : array(), 'eco_nw_pattern_entry', 'Mẫu chăn ga'),
    );
    foreach ($groups as $group) {
        list($key, $items, $reader, $kind) = $group;
        foreach ($items as $item) {
            $product = eco_gia_find_product(isset($item['woo']) ? $item['woo'] : array());
            $on = $product && get_post_meta($product->get_id(), ECO_NW_META, true) === '1';
            $entry = $on ? call_user_func($reader, $product) : array();
            // "Hiểu kỹ trước khi chọn" của sản phẩm lẻ: dùng khi Ecopillo đã sửa, không cần tích ("-" là đã xoá trắng)
            $hk = $product && $key === 'sanPham' ? (string) get_post_meta($product->get_id(), ECO_NW_META_HIEU_KY, true) : '';
            if ($hk !== '') {
                $entry['hieuKy'] = $hk === '-' ? '-' : mb_substr($hk, 0, 12000, 'UTF-8');
            }
            if ($entry) {
                $result['live'][$key][(string) $item['khoa']] = $entry;
            }
            $result['rows'][] = array(
                'loai' => $kind,
                'ten' => (string) $item['ten'],
                'id' => $product ? $product->get_id() : 0,
                'trangThai' => !$product ? 'Không tìm thấy sản phẩm Woo cùng link' : ($on ? ($entry ? 'Đang lấy từ Woo' : 'Đã tích nhưng Woo trống: giữ nội dung web') : 'Giữ nội dung web'),
            );
        }
    }
    if (!$result['live']['sanPham']) {
        $result['live']['sanPham'] = new stdClass();
    }
    if (!$result['live']['mau']) {
        $result['live']['mau'] = new stdClass();
    }
    return $result;
}

/** Bảng ở trang "Giá trên web": sản phẩm nào đang lấy tên, ảnh, mô tả từ Woo */
function eco_nw_admin_section()
{
    $rows = eco_nw_compute()['rows'];
    $on = count(array_filter($rows, function ($r) {
        return strpos($r['trangThai'], 'Đang lấy') === 0;
    }));
    ?>
    <h2>Tên, ảnh, mô tả lấy từ WooCommerce</h2>
    <p>Sản phẩm có sẵn trên web giữ nội dung của giao diện mới cho tới khi Ecopillo soát xong và tích ô
        <strong>"Giao diện mới dùng tên, ảnh, mô tả của sản phẩm này"</strong> (cột phải trang sửa sản phẩm).
        Đang lấy từ Woo: <strong><?php echo (int) $on; ?></strong> / <?php echo count($rows); ?>.</p>
    <details style="margin-bottom:24px"><summary>Xem từng sản phẩm</summary>
    <table class="widefat striped"><thead><tr><th>Trên web</th><th>Loại</th><th>Trạng thái</th></tr></thead><tbody>
    <?php foreach ($rows as $r) : ?>
        <tr><td><?php if ($r['id']) : ?><a href="<?php echo esc_url(get_edit_post_link($r['id'])); ?>"><?php echo esc_html($r['ten']); ?></a><?php else : echo esc_html($r['ten']); endif; ?></td>
            <td><?php echo esc_html($r['loai']); ?></td>
            <td style="<?php echo strpos($r['trangThai'], 'Không') === 0 ? 'color:#b32d2e' : (strpos($r['trangThai'], 'Đang') === 0 ? 'color:#1d6b30;font-weight:600' : ''); ?>"><?php echo esc_html($r['trangThai']); ?></td></tr>
    <?php endforeach; ?>
    </tbody></table></details>
    <?php
}
