<?php
/**
 * Menu "Nội dung web": mỗi bộ dữ liệu (noi-dung.php) một trang sửa, dựng tự động từ các ô khai trong code.
 * Bộ một đối tượng: một form. Bộ danh sách: mỗi dòng một khung, thêm / xoá / lên / xuống, rồi Lưu.
 * Ảnh chọn từ Thư viện WordPress. "Trả về nội dung gốc": xoá bản đã lưu, web dùng nội dung trong code.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'eco_nd_menu');
function eco_nd_menu()
{
    add_menu_page('Nội dung web', 'Nội dung web', ECO_ND_CAP, 'ecopillo-noi-dung', 'eco_nd_overview', 'dashicons-edit-page', 25);
    foreach (eco_nd_sets() as $key => $set) {
        add_submenu_page('ecopillo-noi-dung', $set['ten'], $set['ten'], ECO_ND_CAP, 'ecopillo-nd-' . $key, 'eco_nd_page');
    }
}

add_action('admin_enqueue_scripts', 'eco_nd_assets');
function eco_nd_assets($hook)
{
    if (strpos((string) $hook, 'ecopillo-nd-') !== false) {
        wp_enqueue_media(); // hộp chọn ảnh của Thư viện
    }
}

function eco_nd_page_url($key, $args = array())
{
    return add_query_arg($args, admin_url('admin.php?page=ecopillo-nd-' . $key));
}

function eco_nd_overview()
{
    if (!current_user_can(ECO_ND_CAP)) {
        return;
    }
    echo '<div class="wrap"><h1>Nội dung web</h1>';
    echo '<p>Sửa chữ, số điện thoại, đại lý, ảnh… hiện trên web. Bấm Lưu là web đổi ngay (khách tải lại trang là thấy). Bộ chưa sửa lần nào thì web dùng nội dung có sẵn.</p>';
    echo '<p>Giá, hết hàng: sửa trong <a href="' . esc_url(admin_url('edit.php?post_type=product')) . '">Sản phẩm</a> (xem <a href="' . esc_url(admin_url('edit.php?post_type=product&page=ecopillo-gia-web')) . '">Giá trên web</a>). Bài viết: mục Bài viết.</p>';
    $groups = array();
    foreach (eco_nd_sets() as $key => $set) {
        $groups[isset($set['nhom']) ? $set['nhom'] : 'Khác'][$key] = $set;
    }
    foreach ($groups as $group => $sets) {
        echo '<h2>' . esc_html($group) . '</h2><table class="widefat striped" style="max-width:960px"><tbody>';
        foreach ($sets as $key => $set) {
            $saved = eco_nd_saved($key);
            $state = $saved ? 'Đã sửa lúc ' . (isset($saved['luc']) ? $saved['luc'] : '') : 'Đang dùng nội dung có sẵn';
            echo '<tr><td style="width:260px"><a href="' . esc_url(eco_nd_page_url($key)) . '"><strong>' . esc_html($set['ten']) . '</strong></a></td><td>'
                . esc_html($set['moTa']) . '</td><td style="width:220px;color:#555">' . esc_html($state) . '</td></tr>';
        }
        echo '</tbody></table>';
    }
    echo '</div>';
}

/* ---------------------------------------------------------------- Lưu */

add_action('admin_post_eco_nd_luu', 'eco_nd_save');
function eco_nd_save()
{
    if (!current_user_can(ECO_ND_CAP)) {
        wp_die('Không có quyền.');
    }
    $key = isset($_POST['bo']) ? sanitize_key(wp_unslash($_POST['bo'])) : '';
    $sets = eco_nd_sets();
    if (!isset($sets[$key])) {
        wp_die('Không có bộ dữ liệu này.');
    }
    check_admin_referer('eco_nd_luu_' . $key);
    $set = $sets[$key];

    if (!empty($_POST['tra-ve-goc'])) {
        delete_option(ECO_ND_OPT_PREFIX . $key);
        eco_dl_write();
        wp_safe_redirect(eco_nd_page_url($key, array('ket-qua' => 'goc')));
        exit;
    }

    $raw = isset($_POST['du_lieu']) && is_array($_POST['du_lieu']) ? wp_unslash($_POST['du_lieu']) : array();
    $errors = array();
    if ($set['kieu'] === 'mot') {
        $value = eco_nd_clean_row($set, $raw, $errors);
        if ($value === null) {
            wp_safe_redirect(eco_nd_page_url($key, array('ket-qua' => 'thieu', 'o' => rawurlencode(implode(', ', $errors)))));
            exit;
        }
    } else {
        $value = array();
        $dropped = 0;
        foreach (array_slice(array_values($raw), 0, 300) as $row) {
            $row_errors = array();
            $clean = is_array($row) ? eco_nd_clean_row($set, $row, $row_errors) : null;
            if ($clean === null) {
                $dropped++;
                continue;
            }
            $value[] = $clean;
        }
        if (!$value) {
            wp_safe_redirect(eco_nd_page_url($key, array('ket-qua' => 'rong')));
            exit;
        }
    }
    update_option(ECO_ND_OPT_PREFIX . $key, array('giaTri' => $value, 'luc' => current_time('mysql'), 'nguoi' => get_current_user_id()), false);
    eco_dl_write();
    $args = array('ket-qua' => 'ok');
    if (!empty($dropped)) {
        $args['bo-dong'] = (int) $dropped;
    }
    wp_safe_redirect(eco_nd_page_url($key, $args));
    exit;
}

/* ---------------------------------------------------------------- Màn hình sửa */

/** Một ô nhập; $name là tên gốc, ví dụ du_lieu[3][ten] */
function eco_nd_input($field, $name, $value)
{
    $id = 'eco-' . md5($name);
    $hint = !empty($field['goiY']) ? '<p class="description">' . esc_html($field['goiY']) . '</p>' : '';
    $label = '<label for="' . esc_attr($id) . '"><strong>' . esc_html($field['nhan']) . '</strong>' . (!empty($field['batBuoc']) ? ' <span style="color:#b32d2e">*</span>' : '') . '</label><br>';
    switch ($field['kieu']) {
        case 'doan':
            return $label . '<textarea id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" rows="3" class="large-text">' . esc_textarea((string) $value) . '</textarea>' . $hint;
        case 'chon':
            $html = $label . '<select id="' . esc_attr($id) . '" name="' . esc_attr($name) . '">';
            foreach ((array) $field['luaChon'] as $option) {
                $html .= '<option value="' . esc_attr($option) . '"' . selected($value, $option, false) . '>' . esc_html($option) . '</option>';
            }
            return $html . '</select>' . $hint;
        case 'ngay-nghi':
            $days = array('Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy');
            $html = '<strong>' . esc_html($field['nhan']) . '</strong><br>';
            foreach ($days as $i => $day) {
                $html .= '<label style="margin-right:12px"><input type="checkbox" name="' . esc_attr($name) . '[]" value="' . $i . '"' . (in_array($i, (array) $value, true) ? ' checked' : '') . '> ' . esc_html($day) . '</label>';
            }
            return $html . $hint;
        case 'ds-anh':
            $list = is_array($value) ? implode("\n", $value) : '';
            return $label . '<textarea id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" rows="3" class="large-text code eco-ds-anh">' . esc_textarea($list) . '</textarea>'
                . '<button type="button" class="button eco-them-anh" data-dich="' . esc_attr($id) . '">Thêm ảnh từ Thư viện</button>'
                . '<p class="description">Mỗi dòng một link ảnh.' . (!empty($field['goiY']) ? ' ' . esc_html($field['goiY']) : '') . '</p>';
        case 'anh':
            $img = is_array($value) ? $value : array('src' => '', 'srcSet' => '', 'alt' => '');
            $src = isset($img['src']) ? (string) $img['src'] : '';
            return '<strong>' . esc_html($field['nhan']) . '</strong>' . (!empty($field['batBuoc']) ? ' <span style="color:#b32d2e">*</span>' : '') . '<br>'
                . '<div class="eco-anh" style="display:flex;gap:12px;align-items:flex-start">'
                . '<img src="' . esc_url($src) . '" alt="" style="width:120px;height:90px;object-fit:cover;background:#eee;' . ($src === '' ? 'visibility:hidden' : '') . '">'
                . '<div><input type="hidden" class="eco-anh-src" name="' . esc_attr($name) . '[src]" value="' . esc_attr($src) . '">'
                . '<input type="hidden" class="eco-anh-srcset" name="' . esc_attr($name) . '[srcSet]" value="' . esc_attr(isset($img['srcSet']) ? $img['srcSet'] : '') . '">'
                . '<button type="button" class="button eco-chon-anh">Chọn ảnh</button><br>'
                . '<label>Mô tả ảnh (cho người không nhìn thấy, cho Google) <input type="text" class="regular-text" name="' . esc_attr($name) . '[alt]" value="' . esc_attr(isset($img['alt']) ? $img['alt'] : '') . '"></label></div></div>' . $hint;
        default:
            $type = $field['kieu'] === 'link' ? 'url' : 'text';
            $extra = $field['kieu'] === 'so' ? ' inputmode="decimal"' : ($field['kieu'] === 'gio' ? ' placeholder="08:30" pattern="([01][0-9]|2[0-3]):[0-5][0-9]"' : '');
            $text = is_array($value) ? '' : (string) $value;
            return $label . '<input id="' . esc_attr($id) . '" type="' . $type . '" class="regular-text" name="' . esc_attr($name) . '" value="' . esc_attr($text) . '"' . $extra . '>' . $hint;
    }
}

function eco_nd_row_html($set, $index, $row)
{
    $title = !empty($set['tieuDeDong']) && isset($row[$set['tieuDeDong']]) ? (string) $row[$set['tieuDeDong']] : 'Dòng mới';
    $html = '<fieldset class="eco-dong" style="background:#fff;border:1px solid #ccd0d4;padding:12px 16px;margin:0 0 12px">';
    $html .= '<legend style="padding:0 6px"><strong class="eco-tieu-de">' . esc_html($title) . '</strong> '
        . '<button type="button" class="button-link eco-len">Lên</button> · <button type="button" class="button-link eco-xuong">Xuống</button> · '
        . '<button type="button" class="button-link eco-xoa" style="color:#b32d2e">Xoá dòng</button></legend>';
    if (!empty($set['khoaDong'])) {
        $html .= '<input type="hidden" name="du_lieu[' . $index . '][' . esc_attr($set['khoaDong']) . ']" value="' . esc_attr(isset($row[$set['khoaDong']]) ? (string) $row[$set['khoaDong']] : '') . '">';
    }
    foreach ($set['truong'] as $field) {
        $value = isset($row[$field['khoa']]) ? $row[$field['khoa']] : '';
        $html .= '<div style="margin:8px 0">' . eco_nd_input($field, 'du_lieu[' . $index . '][' . $field['khoa'] . ']', $value) . '</div>';
    }
    return $html . '</fieldset>';
}

function eco_nd_page()
{
    if (!current_user_can(ECO_ND_CAP)) {
        return;
    }
    $page = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : '';
    $key = substr($page, strlen('ecopillo-nd-'));
    $sets = eco_nd_sets();
    if (!isset($sets[$key])) {
        echo '<div class="wrap"><p>Không có bộ dữ liệu này.</p></div>';
        return;
    }
    $set = $sets[$key];
    $value = eco_nd_current($set);
    $saved = eco_nd_saved($key);
    $result = isset($_GET['ket-qua']) ? sanitize_key(wp_unslash($_GET['ket-qua'])) : '';
    $notices = array(
        'ok' => array('success', 'Đã lưu. Web đã đổi (khách tải lại trang là thấy).'),
        'goc' => array('success', 'Đã trả về nội dung có sẵn của web.'),
        'rong' => array('error', 'Chưa lưu: danh sách không còn dòng nào đủ ô bắt buộc.'),
        'thieu' => array('error', 'Chưa lưu: còn ô bắt buộc để trống hoặc sai'),
    );
    echo '<div class="wrap"><h1>' . esc_html($set['ten']) . '</h1><p>' . esc_html($set['moTa']) . '</p>';
    if (isset($notices[$result])) {
        $text = $notices[$result][1];
        if ($result === 'thieu' && isset($_GET['o'])) {
            $text .= ': ' . sanitize_text_field(rawurldecode(wp_unslash($_GET['o'])));
        }
        if ($result === 'ok' && isset($_GET['bo-dong'])) {
            $text .= ' ' . (int) $_GET['bo-dong'] . ' dòng thiếu ô bắt buộc (*) đã bị bỏ.';
        }
        echo '<div class="notice notice-' . esc_attr($notices[$result][0]) . '"><p>' . esc_html($text) . '</p></div>';
    }
    echo '<p style="color:#555">' . ($saved ? 'Đang dùng bản đã sửa lúc ' . esc_html(isset($saved['luc']) ? $saved['luc'] : '') . '.' : 'Đang dùng nội dung có sẵn của web (chưa sửa lần nào).') . ' Ô có dấu <span style="color:#b32d2e">*</span> là bắt buộc.</p>';

    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '" id="eco-nd-form">';
    echo '<input type="hidden" name="action" value="eco_nd_luu"><input type="hidden" name="bo" value="' . esc_attr($key) . '">';
    wp_nonce_field('eco_nd_luu_' . $key);
    if ($set['kieu'] === 'mot') {
        echo '<div style="background:#fff;border:1px solid #ccd0d4;padding:12px 16px;max-width:960px">';
        foreach ($set['truong'] as $field) {
            echo '<div style="margin:10px 0">' . eco_nd_input($field, 'du_lieu[' . $field['khoa'] . ']', isset($value[$field['khoa']]) ? $value[$field['khoa']] : '') . '</div>'; // eco_nd_input đã thoát chữ
        }
        echo '</div>';
    } else {
        echo '<div id="eco-dong-list" style="max-width:960px">';
        foreach (array_values((array) $value) as $i => $row) {
            echo eco_nd_row_html($set, $i, is_array($row) ? $row : array()); // đã thoát chữ
        }
        echo '</div><template id="eco-dong-mau">' . eco_nd_row_html($set, '__I__', array()) . '</template>';
        echo '<p><button type="button" class="button" id="eco-them-dong">+ Thêm dòng</button></p>';
    }
    echo '<p class="submit"><button type="submit" class="button button-primary">Lưu</button> ';
    if ($saved) {
        echo '<button type="submit" name="tra-ve-goc" value="1" class="button" onclick="return confirm(\'Bỏ bản đã sửa, trả về nội dung có sẵn của web?\')">Trả về nội dung gốc</button>';
    }
    echo '</p></form></div>';
    eco_nd_script();
}

/** Thêm / xoá / đổi thứ tự dòng, chọn ảnh từ Thư viện. Trước khi gửi đánh số lại dòng theo thứ tự đang thấy */
function eco_nd_script()
{
    ?>
    <script>
    (function () {
        var list = document.getElementById('eco-dong-list');
        var form = document.getElementById('eco-nd-form');
        var tpl = document.getElementById('eco-dong-mau');
        var add = document.getElementById('eco-them-dong');
        if (add && tpl && list) {
            add.addEventListener('click', function () {
                list.insertAdjacentHTML('beforeend', tpl.innerHTML.replace(/__I__/g, String(Date.now())));
            });
        }
        document.addEventListener('click', function (e) {
            var t = e.target;
            var row = t.closest && t.closest('.eco-dong');
            if (row && t.classList.contains('eco-xoa')) { if (confirm('Xoá dòng này?')) row.remove(); }
            if (row && t.classList.contains('eco-len') && row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
            if (row && t.classList.contains('eco-xuong') && row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
            if (t.classList.contains('eco-chon-anh') || t.classList.contains('eco-them-anh')) {
                e.preventDefault();
                var many = t.classList.contains('eco-them-anh');
                var frame = wp.media({ title: 'Chọn ảnh', library: { type: 'image' }, multiple: many, button: { text: 'Dùng ảnh này' } });
                frame.on('select', function () {
                    var items = frame.state().get('selection').toJSON();
                    if (many) {
                        var box = document.getElementById(t.getAttribute('data-dich'));
                        box.value = (box.value.trim() ? box.value.trim() + '\n' : '') + items.map(function (a) { return a.url; }).join('\n');
                        return;
                    }
                    var a = items[0];
                    var wrap = t.closest('.eco-anh');
                    var sizes = a.sizes || {};
                    var set = Object.keys(sizes).map(function (k) { return sizes[k]; })
                        .filter(function (s) { return s.width >= 300; })
                        .map(function (s) { return s.url + ' ' + s.width + 'w'; });
                    wrap.querySelector('.eco-anh-src').value = a.url;
                    wrap.querySelector('.eco-anh-srcset').value = set.join(', ');
                    var alt = wrap.querySelector('input[name$="[alt]"]');
                    if (alt && !alt.value) alt.value = a.alt || '';
                    var img = wrap.querySelector('img');
                    img.src = (sizes.medium || a).url;
                    img.style.visibility = 'visible';
                });
                frame.open();
            }
        });
        if (form && list) {
            form.addEventListener('submit', function () {
                Array.prototype.forEach.call(list.querySelectorAll('.eco-dong'), function (row, i) {
                    Array.prototype.forEach.call(row.querySelectorAll('[name^="du_lieu["]'), function (el) {
                        el.name = el.name.replace(/^du_lieu\[[^\]]*\]/, 'du_lieu[' + i + ']');
                    });
                });
            });
        }
    })();
    </script>
    <?php
}
