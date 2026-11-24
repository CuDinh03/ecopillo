<?php
/**
 * Mẫu mới Ecopillo thêm trong WooCommerce (giai đoạn 4, docs/ke-hoach-khach-tu-sua-du-lieu.md).
 *
 * Cách Ecopillo thêm: Sản phẩm → Thêm mới; xếp vào danh mục bộ sưu tập (ví dụ "Bộ sưu tập Eco Rosa");
 * ô "Mã sản phẩm" (SKU) ghi mã mẫu (ER50); dòng đầu "Mô tả ngắn" ghi tên màu; ảnh sản phẩm + ảnh thư viện sản phẩm;
 * biến thể theo cỡ như các mẫu cũ (Free Size / 200*220, kiểu ga). Đăng.
 *
 * Plugin (khi đã bật lấy giá Woo):
 * - Tìm sản phẩm đã đăng trong danh mục một bộ sưu tập mà web chưa biết (không có trong khung giá, không phải link cũ đã 301).
 * - Đọc mã, tên màu, ảnh, giá ba cỡ, hết hàng → `mauMoi` trong du-lieu.js (src/data/liveData.ts ghép vào bộ sưu tập).
 * - Link /san-pham/<tên sản phẩm>/: trả trang khung của giao diện mới (trang một mẫu có sẵn, bỏ phần thân, sửa tiêu đề,
 *   canonical, ảnh chia sẻ) để trình duyệt vẽ đúng mẫu mới. Không tạo file, không sửa .htaccess.
 * Mẫu thiếu mã, ảnh, giá hay link có chữ chất liệu cũ thì không hiện, và được báo ở Sản phẩm → Giá trên web.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ECO_MM_OPT_TRANG', 'ecopillo_mau_moi_trang');

/** Tên sản phẩm Woo web đã biết (mẫu, sản phẩm có trang; link cũ đã 301) */
function eco_mm_known_slugs()
{
    $frame = eco_gia_frame();
    $known = array();
    foreach (array('mau', 'sanPham') as $part) {
        foreach (isset($frame[$part]) ? $frame[$part] : array() as $item) {
            foreach ((array) $item['woo'] as $slug) {
                $known[$slug] = true;
            }
        }
    }
    foreach (isset($frame['slugCu']) ? $frame['slugCu'] : array() as $slug) {
        $known[$slug] = true;
    }
    return $known;
}

function eco_mm_image($attachment_id)
{
    $src = $attachment_id ? wp_get_attachment_image_url($attachment_id, 'full') : '';
    if (!$src) {
        return null;
    }
    return array(
        'src' => $src,
        'srcSet' => (string) wp_get_attachment_image_srcset($attachment_id, 'full'),
        'alt' => (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
    );
}

/** Mã mẫu: ô Mã sản phẩm, không có thì tìm trong tên / link (…-er50) */
function eco_mm_code($product)
{
    $sku = strtoupper(trim((string) $product->get_sku()));
    if (preg_match('/^[A-Z]{2}\d{2,3}$/', $sku)) {
        return $sku;
    }
    foreach (array($product->get_slug(), $product->get_name()) as $text) {
        if (preg_match('/(?:^|[^a-z0-9])(e[a-z])[- ]?(\d{2,3})(?:$|[^0-9])/i', (string) $text, $m)) {
            return strtoupper($m[1] . $m[2]);
        }
    }
    return '';
}

/** Tên màu: dòng đầu Mô tả ngắn, không có thì tên sản phẩm */
function eco_mm_color($product)
{
    $short = trim(wp_strip_all_tags((string) $product->get_short_description()));
    $first = $short === '' ? '' : trim((string) strtok($short, "\r\n"));
    return mb_substr($first !== '' ? $first : (string) $product->get_name(), 0, 80, 'UTF-8');
}

/**
 * Mẫu mới và bảng báo. @return array{live: array, rows: array, pages: array}
 * pages: tên link → trang khung (đường dẫn trang mẫu có sẵn của cùng bộ)
 */
function eco_mm_compute()
{
    $frame = eco_gia_frame();
    $known = eco_mm_known_slugs();
    $live = array();
    $rows = array();
    $pages = array();
    $sizes = array('160x200', '180x200', '200x220');
    foreach (isset($frame['boSuuTap']) ? $frame['boSuuTap'] : array() as $col) {
        $products = wc_get_products(array('status' => 'publish', 'limit' => 200, 'category' => array($col['danhMucWoo'])));
        foreach ($products as $product) {
            $slug = $product->get_slug();
            if (isset($known[$slug])) {
                continue;
            }
            $code = eco_mm_code($product);
            $problems = array();
            if ($code === '') {
                $problems[] = 'thiếu mã mẫu (ghi vào ô Mã sản phẩm, ví dụ ER50)';
            } elseif (in_array($code, (array) $col['maDaCo'], true)) {
                $problems[] = 'mã ' . $code . ' đã có trên web';
            }
            if (!preg_match('/^[a-z0-9-]{3,200}$/', $slug) || preg_match('/tencel|60s/', $slug)) {
                $problems[] = 'đường dẫn (slug) chỉ được dùng chữ không dấu, số, gạch nối, và không có chữ chất liệu cũ';
            }
            $image = eco_mm_image($product->get_image_id());
            if (!$image) {
                $problems[] = 'thiếu ảnh sản phẩm';
            }
            $vars = eco_gia_variants($product);
            $prices = array();
            $chun = array();
            $sold = array();
            foreach ($sizes as $size) {
                $m = eco_gia_match_set($vars, $size, 'phu');
                $price = $m ? eco_gia_price_of($m['obj']) : null;
                if ($price) {
                    $prices[$size] = $price;
                }
                if ($m && !$m['obj']->is_in_stock()) {
                    $sold[] = $size;
                }
                if (!empty($col['coChun'])) {
                    $mc = eco_gia_match_set($vars, $size, 'chun');
                    $cp = $mc ? eco_gia_price_of($mc['obj']) : null;
                    if ($cp) {
                        $chun[$size] = $cp;
                    }
                }
            }
            if (count($prices) < count($sizes)) {
                $problems[] = 'thiếu giá cỡ ' . implode(', ', array_diff($sizes, array_keys($prices)));
            }
            $rows[] = array(
                'ten' => $product->get_name(), 'bo' => $col['ten'], 'ma' => $code, 'id' => $product->get_id(),
                'trangThai' => $problems ? 'Chưa hiện: ' . implode('; ', $problems) : 'Đang hiện trên web',
            );
            if ($problems) {
                continue;
            }
            $gallery = array();
            foreach ($product->get_gallery_image_ids() as $id) {
                $img = eco_mm_image($id);
                if ($img) {
                    $gallery[] = $img;
                }
            }
            $item = array(
                'bo' => $col['id'], 'ma' => $code, 'ten' => eco_mm_color($product), 'duongDan' => $slug,
                'anh' => $image, 'anhPhu' => array_slice($gallery, 0, 12), 'gia' => $prices, 'het' => $sold,
            );
            if (count($chun) === count($sizes)) {
                $item['giaChun'] = $chun;
            }
            // Câu chuyện phối màu: ô Mô tả, dòng đầu là tên (bo-suu-tap-moi.php)
            $story = function_exists('eco_bst_story') ? eco_bst_story($product) : null;
            if ($story) {
                $item['cauChuyen'] = $story;
            }
            $swatch = eco_mm_swatch($product);
            if ($swatch !== '') {
                $item['mauNen'] = $swatch;
            }
            $live[] = $item;
            $pages[$slug] = array('khung' => $col['khung'], 'tieuDe' => $col['ten'] . ' ' . $code . ' · ' . $item['ten'], 'anh' => $image['src']);
        }
    }
    return array('live' => $live, 'rows' => $rows, 'pages' => $pages);
}

/* ---------------------------------------------------------------- Trang khung cho link mẫu mới */

/** Khách này đang xem giao diện mới không (Bật, hoặc Thử kín có cookie thử) */
function eco_mm_visitor_sees_new()
{
    $mode = function_exists('eco_gdm_mode') ? eco_gdm_mode() : 'tat';
    return $mode === 'bat' || ($mode === 'thu-kin' && isset($_COOKIE[ECO_GDM_COOKIE]) && $_COOKIE[ECO_GDM_COOKIE] === '1');
}

add_action('template_redirect', 'eco_mm_serve', 0);
function eco_mm_serve()
{
    $path = (string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
    if (!preg_match('#^/san-pham/([a-z0-9-]+)/?$#', $path, $m) || !eco_mm_visitor_sees_new()) {
        return;
    }
    $pages = get_option(ECO_MM_OPT_TRANG, array());
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

/** Trang khung: bỏ phần thân dựng sẵn (của mẫu khác), sửa tiêu đề, canonical, ảnh chia sẻ, bỏ dữ liệu có cấu trúc của mẫu khác */
function eco_mm_shell($html, $slug, $page)
{
    status_header(200);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    // Trang bài viết mới (bai-viet-moi.php) ghi sẵn `url`; mẫu mới, sản phẩm mới nằm dưới /san-pham/
    $url = home_url(isset($page['url']) ? (string) $page['url'] : '/san-pham/' . $slug . '/');
    $title = esc_html($page['tieuDe'] . ' · Ecopillo');
    $html = preg_replace('#<title>[^<]*</title>#', '<title>' . $title . '</title>', $html, 1);
    $html = preg_replace('#(<link rel="canonical" href=")[^"]*(")#', '${1}' . esc_url($url) . '${2}', $html);
    $html = preg_replace('#(<meta property="og:url" content=")[^"]*(")#', '${1}' . esc_url($url) . '${2}', $html);
    $html = preg_replace('#(<meta property="og:title" content=")[^"]*(")#', '${1}' . esc_attr($page['tieuDe'] . ' · Ecopillo') . '${2}', $html);
    if (!empty($page['anh'])) {
        $html = preg_replace('#(<meta property="og:image" content=")[^"]*(")#', '${1}' . esc_url($page['anh']) . '${2}', $html);
    }
    $html = preg_replace('#<script type="application/ld\+json">.*?</script>#s', '', $html);
    // Thân dựng sẵn nằm trong #root, ngay trước thẻ script hiệu ứng: bỏ để trình duyệt vẽ mẫu mới (main.tsx)
    $open = strpos($html, '<div id="root"');
    $after = strpos($html, '<script src="/hieu-ung/');
    if ($open !== false && $after !== false && $after > $open) {
        $open_end = strpos($html, '>', $open) + 1;
        $close = strrpos(substr($html, 0, $after), '</div>');
        if ($close !== false && $close >= $open_end) {
            $html = substr($html, 0, $open_end) . substr($html, $close);
        }
    }
    return $html;
}

/**
 * Màu chấm / dải của mẫu (ô lọc màu, bìa bộ sưu tập, đặt hàng) (đợt F): thuộc tính sản phẩm tên "Mã màu", giá trị dạng #c9a7b4.
 * Không có hoặc sai dạng thì rỗng (web giữ màu đang có, mẫu mới dùng màu be nhạt).
 */
function eco_mm_swatch($product)
{
    foreach ($product->get_attributes() as $attr) {
        if (!is_object($attr) || eco_gia_key(wc_attribute_label($attr->get_name(), $product)) !== 'ma-mau') {
            continue;
        }
        $values = $attr->is_taxonomy()
            ? wc_get_product_terms($product->get_id(), $attr->get_name(), array('fields' => 'names'))
            : $attr->get_options();
        foreach ((array) $values as $value) {
            $hex = strtolower(trim((string) $value));
            $hex = strpos($hex, '#') === 0 ? $hex : '#' . $hex;
            if (preg_match('/^#[0-9a-f]{6}$/', $hex)) {
                return $hex;
            }
        }
    }
    return '';
}
