<?php
/**
 * Bộ sưu tập mới và câu chuyện phối màu Ecopillo nhập trong WooCommerce (đợt C, docs/ke-hoach-khach-tu-sua-du-lieu.md mục 5;
 * owner 20/11/2026: "đảm bảo tất cả mọi thứ trên web, khách đều tự chỉnh sửa được").
 *
 * Bộ mới: Sản phẩm → Danh mục, tạo danh mục (tên: "Bộ sưu tập Eco …"), Mô tả = câu giới thiệu bộ; ở khung "Giao diện mới" của
 * trang sửa danh mục tích "Hiện thành bộ sưu tập trên giao diện mới", chọn kiểu (bộ ga phủ / bộ ga chun), điền khẩu hiệu,
 * câu chuyện của bộ. Mẫu của bộ: sản phẩm trong danh mục đó, cùng quy tắc với mẫu mới (mau-moi.php): mã ở ô Mã sản phẩm,
 * tên màu dòng đầu Mô tả ngắn, ảnh, biến thể ba cỡ. Link trang bộ là link danh mục Woo; plugin trả trang khung (một trang bộ có sẵn
 * cùng kiểu) cho link đó và cho link từng mẫu.
 * Bộ có sẵn (8 danh mục bộ sưu tập web đang dùng): cùng khung đó, tích là web dùng khẩu hiệu, mô tả danh mục, câu chuyện ở đây.
 *
 * Câu chuyện phối màu: ô Mô tả của sản phẩm mẫu, dòng đầu là tên câu chuyện, các dòng sau là đoạn kể; thuộc tính "Gam màu"
 * ghi một gam (Xanh; Hồng, đỏ cam; Tím; Trắng, kem; Xám; Cho bé). Mẫu mới, mẫu của bộ mới: dùng ngay. Mẫu có sẵn: khi đã tích
 * "Giao diện mới dùng tên, ảnh, mô tả" (noi-dung-woo.php).
 * Ghi vào du-lieu.js: `boSuuTapMoi`, `boSuuTapChu` (src/data/liveData.ts). Dữ liệu không rời hosting.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_BST_META_BAT', '_eco_bst_bat');
define('ECO_BST_META_KIEU', '_eco_bst_kieu');
define('ECO_BST_META_KHAU_HIEU', '_eco_bst_khau_hieu');
define('ECO_BST_META_CAU_CHUYEN', '_eco_bst_cau_chuyen');
define('ECO_BST_META_TRONG_BO', '_eco_bst_trong_bo');
define('ECO_BST_OPT_TRANG', 'ecopillo_bo_moi_trang');

/** Danh mục Woo của bộ có sẵn → mã bộ trên web (khung-gia.json `boSuuTap`) */
function eco_bst_existing()
{
    $map = array();
    foreach (isset(eco_gia_frame()['boSuuTap']) ? (array) eco_gia_frame()['boSuuTap'] : array() as $col) {
        $map[(string) $col['danhMucWoo']] = $col;
    }
    return $map;
}

/** Kiểu bộ mới cho phép: mã → nhãn (khung-gia.json `boMoi.kieu`) */
function eco_bst_kinds()
{
    $frame = eco_gia_frame();
    $kinds = array();
    foreach (isset($frame['boMoi']['kieu']) ? (array) $frame['boMoi']['kieu'] : array() as $id => $kind) {
        $kinds[(string) $id] = (string) $kind['nhan'];
    }
    return $kinds;
}

/* ---------------------------------------------------------------- Khung "Giao diện mới" ở trang danh mục */

add_action('product_cat_edit_form_fields', 'eco_bst_fields_edit', 20);
function eco_bst_fields_edit($term)
{
    $existing = eco_bst_existing();
    $col = isset($existing[$term->slug]) ? $existing[$term->slug] : null;
    $on = get_term_meta($term->term_id, ECO_BST_META_BAT, true) === '1';
    $kind = (string) get_term_meta($term->term_id, ECO_BST_META_KIEU, true);
    wp_nonce_field('eco_bst_luu', 'eco_bst_nonce');
    ?>
    <tr class="form-field"><th scope="row" colspan="2"><h2 style="margin:16px 0 0">Giao diện mới</h2></th></tr>
    <tr class="form-field">
        <th scope="row">Dùng trên giao diện mới</th>
        <td><label><input type="checkbox" name="eco_bst_bat" value="1" <?php checked($on); ?>>
            <?php echo $col
                ? 'Giao diện mới dùng tên, mô tả, khẩu hiệu, câu chuyện ở đây cho bộ ' . esc_html($col['ten'])
                : 'Hiện thành bộ sưu tập trên giao diện mới'; ?></label>
            <p class="description"><?php echo $col
                ? 'Tích khi đã soát xong. Ô nào để trống thì web giữ chữ đang có. Ô "Tên" phía trên (bỏ chữ "Bộ sưu tập" ở đầu) là tên bộ trên web; ô "Mô tả" là câu giới thiệu bộ.'
                : 'Mỗi sản phẩm trong danh mục này là một mẫu: mã mẫu ở ô Mã sản phẩm, tên màu ở dòng đầu Mô tả ngắn, ảnh, biến thể ba cỡ (1m6, 1m8, 2m2; chăn hè một giá thì để sản phẩm đơn). Ô "Mô tả" phía trên là câu giới thiệu bộ. Đường dẫn (slug) không dấu, ví dụ bo-suu-tap-eco-lumi.'; ?></p></td>
    </tr>
    <?php if (!$col) : ?>
    <tr class="form-field">
        <th scope="row"><label for="eco_bst_kieu">Kiểu bộ</label></th>
        <td><select name="eco_bst_kieu" id="eco_bst_kieu">
            <?php foreach (eco_bst_kinds() as $id => $label) : ?>
                <option value="<?php echo esc_attr($id); ?>" <?php selected($kind, $id); ?>><?php echo esc_html($label); ?></option>
            <?php endforeach; ?>
        </select></td>
    </tr>
    <?php endif; ?>
    <tr class="form-field">
        <th scope="row"><label for="eco_bst_khau_hieu">Khẩu hiệu</label></th>
        <td><input type="text" name="eco_bst_khau_hieu" id="eco_bst_khau_hieu" maxlength="200" value="<?php echo esc_attr((string) get_term_meta($term->term_id, ECO_BST_META_KHAU_HIEU, true)); ?>">
            <p class="description">Một câu ngắn dưới tên bộ, ví dụ "Thanh khiết và sinh động".</p></td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="eco_bst_trong_bo">Trong bộ gồm</label></th>
        <td><textarea name="eco_bst_trong_bo" id="eco_bst_trong_bo" rows="5" maxlength="1500"><?php echo esc_textarea((string) get_term_meta($term->term_id, ECO_BST_META_TRONG_BO, true)); ?></textarea>
            <p class="description">Mỗi dòng một món, ví dụ "Vỏ chăn 4 mùa 200×220, có khoá kéo". Để trống: theo kiểu bộ (bộ mới) hoặc giữ như đang có (bộ có sẵn).</p></td>
    </tr>
    <tr class="form-field">
        <th scope="row"><label for="eco_bst_cau_chuyen">Câu chuyện của bộ</label></th>
        <td><textarea name="eco_bst_cau_chuyen" id="eco_bst_cau_chuyen" rows="5" maxlength="1200"><?php echo esc_textarea((string) get_term_meta($term->term_id, ECO_BST_META_CAU_CHUYEN, true)); ?></textarea>
            <p class="description">Hiện ở phần bìa trang bộ. Câu chuyện từng mẫu: ô Mô tả của sản phẩm mẫu (dòng đầu là tên câu chuyện), thuộc tính "Gam màu".</p></td>
    </tr>
    <?php
}

add_action('edited_product_cat', 'eco_bst_save');
function eco_bst_save($term_id)
{
    if (!isset($_POST['eco_bst_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eco_bst_nonce'])), 'eco_bst_luu')) {
        return;
    }
    if (!current_user_can('manage_product_terms')) {
        return;
    }
    $was = get_term_meta($term_id, ECO_BST_META_BAT, true) === '1';
    $on = isset($_POST['eco_bst_bat']) && $_POST['eco_bst_bat'] === '1';
    if ($on) {
        update_term_meta($term_id, ECO_BST_META_BAT, '1');
    } else {
        delete_term_meta($term_id, ECO_BST_META_BAT);
    }
    $kind = isset($_POST['eco_bst_kieu']) ? sanitize_key(wp_unslash($_POST['eco_bst_kieu'])) : '';
    if ($kind !== '' && isset(eco_bst_kinds()[$kind])) {
        update_term_meta($term_id, ECO_BST_META_KIEU, $kind);
    }
    foreach (array('eco_bst_khau_hieu' => array(ECO_BST_META_KHAU_HIEU, 200), 'eco_bst_cau_chuyen' => array(ECO_BST_META_CAU_CHUYEN, 1200), 'eco_bst_trong_bo' => array(ECO_BST_META_TRONG_BO, 1500)) as $field => $meta) {
        if (isset($_POST[$field])) {
            $value = sanitize_textarea_field(wp_unslash($_POST[$field]));
            update_term_meta($term_id, $meta[0], mb_substr($value, 0, $meta[1], 'UTF-8'));
        }
    }
    if ($on || $was) {
        eco_gia_mark_dirty();
    }
}

/* ---------------------------------------------------------------- Câu chuyện phối màu */

/** Mã gam từ thuộc tính "Gam màu" (so tên gam không dấu với khung-gia.json `boMoi.gam`) */
function eco_bst_tone($product)
{
    $frame = eco_gia_frame();
    $tones = array();
    foreach (isset($frame['boMoi']['gam']) ? (array) $frame['boMoi']['gam'] : array() as $t) {
        $tones[eco_gia_key($t['ten'])] = (string) $t['id'];
    }
    foreach ($product->get_attributes() as $attr) {
        if (!is_object($attr) || eco_gia_key(wc_attribute_label($attr->get_name(), $product)) !== 'gam-mau') {
            continue;
        }
        $values = $attr->is_taxonomy()
            ? wc_get_product_terms($product->get_id(), $attr->get_name(), array('fields' => 'names'))
            : $attr->get_options();
        foreach ((array) $values as $value) {
            $key = eco_gia_key((string) $value);
            if (isset($tones[$key])) {
                return $tones[$key];
            }
        }
    }
    return '';
}

/** Câu chuyện từ ô Mô tả: dòng đầu (tối đa 80 chữ cái) là tên, các dòng sau là đoạn kể. Không đủ hai phần thì không có */
function eco_bst_story($product)
{
    $points = eco_sp_points($product->get_description());
    if (count($points) < 2 || mb_strlen($points[0], 'UTF-8') > 80) {
        return null;
    }
    $story = array('ten' => $points[0], 'doan' => mb_substr(implode(' ', array_slice($points, 1)), 0, 1200, 'UTF-8'));
    $tone = eco_bst_tone($product);
    if ($tone !== '') {
        $story['gam'] = $tone;
    }
    return $story;
}

/* ---------------------------------------------------------------- Đọc bộ mới, chữ bộ có sẵn */

/** Một mẫu của bộ mới (cùng quy tắc mẫu mới). @return array{0: array|null, 1: string[]} */
function eco_bst_pattern($product, $known, $seen)
{
    $slug = $product->get_slug();
    $code = eco_mm_code($product);
    $problems = array();
    if (isset($known[$slug])) {
        $problems[] = 'đường dẫn trùng một trang có sẵn';
    }
    if ($code === '') {
        $problems[] = 'thiếu mã mẫu (ô Mã sản phẩm)';
    } elseif (isset($seen[$code])) {
        $problems[] = 'trùng mã ' . $code;
    }
    if (!preg_match('/^[a-z0-9-]{3,200}$/', $slug) || preg_match('/tencel|60s/', $slug)) {
        $problems[] = 'đường dẫn (slug) chỉ được dùng chữ không dấu, số, gạch nối, và không có chữ chất liệu cũ';
    }
    $image = function_exists('eco_nw_image') ? eco_nw_image($product->get_image_id()) : eco_mm_image($product->get_image_id());
    if (!$image) {
        $problems[] = 'thiếu ảnh sản phẩm';
    }
    $vars = eco_gia_variants($product);
    $prices = array();
    $sold = array();
    foreach (array('160x200', '180x200', '200x220') as $size) {
        $m = eco_gia_match_set($vars, $size, 'phu');
        $price = $m ? eco_gia_price_of($m['obj']) : null;
        if ($price) {
            $prices[$size] = $price;
        } else {
            $problems[] = 'thiếu giá cỡ ' . $size;
        }
        if ($m && !$m['obj']->is_in_stock()) {
            $sold[] = $size;
        }
    }
    if ($problems) {
        return array(null, $problems);
    }
    $item = array(
        'ma' => $code, 'ten' => eco_mm_color($product), 'duongDan' => $slug, 'anh' => $image,
        'anhPhu' => function_exists('eco_nw_gallery') ? eco_nw_gallery($product) : array(), 'gia' => $prices, 'het' => $sold,
    );
    $story = eco_bst_story($product);
    if ($story) {
        $item['cauChuyen'] = $story;
    }
    $swatch = eco_mm_swatch($product);
    if ($swatch !== '') {
        $item['mauNen'] = $swatch;
    }
    return array($item, array());
}

/**
 * @return array{live: array, chu: array, rows: array, pagesBo: array, pagesMau: array}
 * pagesBo: link trang bộ → trang khung; pagesMau: tên link mẫu → trang khung (gộp vào trang mẫu mới, mau-moi.php)
 */
function eco_bst_compute()
{
    $result = array('live' => array(), 'chu' => array(), 'rows' => array(), 'pagesBo' => array(), 'pagesMau' => array());
    if (!function_exists('wc_get_products')) {
        return $result;
    }
    $frame = eco_gia_frame();
    $existing = eco_bst_existing();
    $kinds = isset($frame['boMoi']['kieu']) ? (array) $frame['boMoi']['kieu'] : array();
    $known_paths = array();
    foreach ($existing as $col) {
        $known_paths[(string) $col['trang']] = true;
    }
    $terms = get_terms(array(
        'taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 60,
        'meta_query' => array(array('key' => ECO_BST_META_BAT, 'value' => '1')),
    ));
    $known = eco_mm_known_slugs();
    foreach (is_array($terms) ? $terms : array() as $term) {
        $text = array_filter(array(
            'khauHieu' => eco_sp_text(get_term_meta($term->term_id, ECO_BST_META_KHAU_HIEU, true), 200),
            'moTa' => eco_sp_text($term->description, 600),
            'cauChuyen' => eco_sp_text(get_term_meta($term->term_id, ECO_BST_META_CAU_CHUYEN, true), 1200),
        ), 'strlen');
        // "Trong bộ gồm": mỗi dòng một món (đợt D)
        $items = array();
        foreach (preg_split('/\R/u', (string) get_term_meta($term->term_id, ECO_BST_META_TRONG_BO, true)) as $line) {
            $line = eco_sp_text($line, 200);
            if ($line !== '') {
                $items[] = $line;
            }
        }
        if ($items) {
            $text['trongBo'] = array_slice($items, 0, 12);
        }
        if (isset($existing[$term->slug])) {
            $col = $existing[$term->slug];
            // Tên bộ: tên danh mục bỏ "Bộ sưu tập" ở đầu (đợt F); khác tên đang có trên web thì dùng
            $existing_name = trim(preg_replace('/^b(ộ|o)\s+s(ư|u)u\s+t(ậ|a)p\s+/iu', '', eco_sp_text($term->name, 80)));
            if ($existing_name !== '' && $existing_name !== (string) $col['ten']) {
                $text['ten'] = $existing_name;
            }
            if ($text) {
                $result['chu'][(string) $col['id']] = $text;
            }
            $result['rows'][] = array('ten' => $term->name, 'id' => $term->term_id, 'trangThai' => $text ? 'Bộ có sẵn: đang dùng chữ ở danh mục' : 'Bộ có sẵn: danh mục chưa có chữ, giữ chữ web');
            continue;
        }
        $problems = array();
        $id = preg_replace('/^bo-suu-tap-/', '', $term->slug);
        if (!preg_match('/^[a-z0-9-]{3,60}$/', $term->slug) || preg_match('/tencel|60s/', $term->slug)) {
            $problems[] = 'đường dẫn (slug) danh mục chỉ được dùng chữ không dấu, số, gạch nối, và không có chữ chất liệu cũ';
        }
        $kind = (string) get_term_meta($term->term_id, ECO_BST_META_KIEU, true);
        if (!isset($kinds[$kind])) {
            $problems[] = 'chưa chọn kiểu bộ';
        }
        $link = get_term_link($term);
        $path = is_wp_error($link) ? '' : trailingslashit((string) parse_url($link, PHP_URL_PATH));
        if (!preg_match('#^/[a-z0-9/-]{3,200}/$#', $path) || isset($known_paths[$path])) {
            $problems[] = 'đường link danh mục trùng một trang có sẵn hoặc không hợp lệ';
        }
        foreach ($existing as $col) {
            if ((string) $col['id'] === $id) {
                $problems[] = 'trùng tên với bộ có sẵn';
            }
        }
        $name = trim(preg_replace('/^b(ộ|o)\s+s(ư|u)u\s+t(ậ|a)p\s+/iu', '', eco_sp_text($term->name, 80)));
        $patterns = array();
        $seen = array();
        $pattern_rows = array();
        foreach (wc_get_products(array('status' => 'publish', 'limit' => 120, 'category' => array($term->slug))) as $product) {
            list($item, $item_problems) = eco_bst_pattern($product, $known, $seen);
            $pattern_rows[] = array(
                'ten' => '· ' . $product->get_name(), 'id' => 0, 'sanPham' => $product->get_id(),
                'trangThai' => $item_problems ? 'Mẫu chưa hiện: ' . implode('; ', $item_problems) : 'Mẫu hợp lệ',
            );
            if ($item) {
                $seen[$item['ma']] = true;
                $patterns[] = $item;
            }
        }
        if (!$patterns) {
            $problems[] = 'chưa có mẫu nào đủ mã, ảnh, giá ba cỡ';
        }
        $result['rows'][] = array(
            'ten' => $term->name, 'id' => $term->term_id,
            'trangThai' => $problems ? 'Bộ mới chưa hiện: ' . implode('; ', $problems) : 'Bộ mới đang hiện trên web (' . count($patterns) . ' mẫu)',
        );
        $result['rows'] = array_merge($result['rows'], $pattern_rows);
        if ($problems) {
            continue;
        }
        $result['live'][] = array_merge(array('khauHieu' => '', 'moTa' => '', 'cauChuyen' => '', 'trongBo' => array()), $text, array(
            'id' => $id, 'ten' => $name, 'kieu' => $kind, 'duongDan' => $path, 'mau' => $patterns,
        ));
        $result['pagesBo'][$path] = array('khung' => $kinds[$kind]['khungBo'], 'tieuDe' => $name, 'anh' => $patterns[0]['anh']['src'], 'url' => $path);
        foreach ($patterns as $p) {
            $result['pagesMau'][$p['duongDan']] = array('khung' => $kinds[$kind]['khungMau'], 'tieuDe' => $name . ' ' . $p['ma'] . ' · ' . $p['ten'], 'anh' => $p['anh']['src']);
        }
    }
    return $result;
}

/* ---------------------------------------------------------------- Trang khung cho link bộ mới */

add_action('template_redirect', 'eco_bst_serve', 0);
function eco_bst_serve()
{
    $path = trailingslashit((string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH));
    if (!preg_match('#^/[a-z0-9/-]{3,200}/$#', $path) || !function_exists('eco_mm_visitor_sees_new') || !eco_mm_visitor_sees_new()) {
        return;
    }
    $pages = get_option(ECO_BST_OPT_TRANG, array());
    if (!is_array($pages) || !isset($pages[$path])) {
        return;
    }
    $page = $pages[$path];
    $file = __DIR__ . '/site' . $page['khung'] . 'index.html';
    $html = is_readable($file) ? (string) file_get_contents($file) : '';
    if ($html === '') {
        return;
    }
    echo eco_mm_shell($html, '', $page); // trang tĩnh của giao diện mới, các chữ chèn vào đã thoát
    exit;
}

/** Bảng ở trang "Giá trên web" */
function eco_bst_admin_section()
{
    $rows = eco_bst_compute()['rows'];
    ?>
    <h2>Bộ sưu tập tạo trong WooCommerce</h2>
    <p>Bộ mới: Sản phẩm → Danh mục, tạo danh mục, ở khung <strong>"Giao diện mới"</strong> tích "Hiện thành bộ sưu tập trên giao diện mới",
        chọn kiểu bộ, điền khẩu hiệu, câu chuyện; thêm các mẫu vào danh mục như thêm mẫu mới. Câu chuyện từng mẫu: ô Mô tả (dòng đầu là tên câu chuyện), thuộc tính "Gam màu".</p>
    <?php if (!$rows) : ?>
        <p style="color:#555">Chưa có danh mục nào tích "Giao diện mới".</p>
    <?php else : ?>
        <table class="widefat striped" style="margin-bottom:24px"><thead><tr><th>Danh mục / mẫu</th><th>Trạng thái</th></tr></thead><tbody>
        <?php foreach ($rows as $r) :
            $link = $r['id'] ? get_edit_term_link($r['id'], 'product_cat', 'product') : (!empty($r['sanPham']) ? get_edit_post_link($r['sanPham']) : ''); ?>
            <tr><td><?php if ($link) : ?><a href="<?php echo esc_url($link); ?>"><?php echo esc_html($r['ten']); ?></a><?php else : echo esc_html($r['ten']); endif; ?></td>
                <td style="<?php echo strpos($r['trangThai'], 'chưa hiện') !== false ? 'color:#b32d2e;font-weight:600' : ''; ?>"><?php echo esc_html($r['trangThai']); ?></td></tr>
        <?php endforeach; ?>
        </tbody></table>
    <?php endif;
}
