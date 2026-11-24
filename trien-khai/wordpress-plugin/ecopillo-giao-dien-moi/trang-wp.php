<?php
/**
 * Trang có sẵn của giao diện mới mà Ecopillo đã đổi SEO, ẩn, hoặc chuyển link (đợt E 24/11/2026; owner: "khách được tuỳ chỉnh
 * toàn bộ bằng wp-admin tất cả các chỗ", "khách muốn thêm SEO vào cho phần danh mục sản phẩm").
 *
 * Bình thường máy chủ trả thẳng file HTML dựng sẵn trong site/ (quy tắc .htaccess, không qua PHP), nên tiêu đề, mô tả trên Google
 * nằm cứng trong file. Khi một trang cần đổi ở máy chủ, plugin tạo file đánh dấu
 * wp-content/uploads/ecopillo-du-lieu/qua-wp/<đường-dẫn>/index.html; quy tắc .htaccess thấy file đó thì để WordPress trả trang,
 * và plugin (eco_tw_serve):
 * - trang danh mục Ecopillo đã ẩn / xoá (danh-muc.php), sản phẩm / mẫu / bài có sẵn đã gỡ (an-xoa.php): trả 301;
 * - trang có SEO Ecopillo điền (Nội dung web → "SEO từng trang", hoặc ô SEO / Yoast ở danh mục Woo): trả HTML dựng sẵn với
 *   thẻ title, description, og:title, og:description, og:image mới (Google, Facebook, Zalo đọc được ngay);
 * - link Ecopillo thêm ở "Chuyển hướng link" mà đang là một trang có sẵn: eco_nd_redirect (noi-dung.php) trả 301 trước.
 * File đánh dấu được ghi lại mỗi lần ghi du-lieu.js (eco_dl_write), trang hết cần thì xoá đánh dấu, máy chủ lại trả file tĩnh.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Thư mục chứa file đánh dấu (trên đĩa) */
function eco_tw_dir()
{
    return eco_gia_dir() . '/qua-wp';
}

/** Đường dẫn web (từ gốc tên miền) tới thư mục dữ liệu plugin ghi, cho quy tắc .htaccess ({DU_LIEU}) */
function eco_tw_data_url_path()
{
    $uploads = wp_upload_dir(null, false);
    return rtrim((string) wp_parse_url($uploads['baseurl'], PHP_URL_PATH), '/') . '/ecopillo-du-lieu';
}

/** Đường dẫn web tới thư mục đánh dấu ({QUA_WP}) */
function eco_tw_marker_url_path()
{
    return eco_tw_data_url_path() . '/qua-wp';
}

/**
 * Sơ đồ trang cho Google (đợt E 24/11/2026): sitemap.xml dựng sẵn, bỏ trang Ecopillo đã gỡ / ẩn, thêm trang Ecopillo tạo sau
 * lần dựng (danh mục mới, bộ sưu tập mới, mẫu mới, sản phẩm mới, bài mới). Quy tắc .htaccess trả file này ở /sitemap.xml.
 */
function eco_tw_write_sitemap()
{
    $source = __DIR__ . '/site/sitemap.xml';
    $xml = is_readable($source) ? (string) file_get_contents($source) : '';
    if (!preg_match_all('#<loc>([^<]+)</loc>(?:<lastmod>([^<]+)</lastmod>)?#', $xml, $m, PREG_SET_ORDER)) {
        return;
    }
    $hidden = eco_tw_hidden_map();
    $urls = array();
    foreach ($m as $row) {
        $path = (string) parse_url(html_entity_decode($row[1]), PHP_URL_PATH);
        if ($path !== '' && !isset($hidden[$path])) {
            $urls[$path] = isset($row[2]) ? $row[2] : '';
        }
    }
    $today = current_time('Y-m-d');
    $add = array();
    foreach ((array) get_option('ecopillo_dm_trang', array()) as $path => $page) {
        $add[] = (string) $path; // danh mục mới
    }
    foreach ((array) get_option('ecopillo_bo_moi_trang', array()) as $path => $page) {
        $add[] = (string) $path; // bộ sưu tập mới
    }
    foreach ((array) get_option('ecopillo_mau_moi_trang', array()) as $slug => $page) {
        $add[] = isset($page['url']) ? (string) $page['url'] : '/san-pham/' . $slug . '/'; // mẫu mới, sản phẩm mới
    }
    foreach ((array) get_option(defined('ECO_BV_OPT_TRANG') ? ECO_BV_OPT_TRANG : 'ecopillo_bai_moi_trang', array()) as $slug => $page) {
        $add[] = isset($page['url']) ? (string) $page['url'] : '/' . $slug . '/'; // bài mới
    }
    foreach ($add as $path) {
        if (eco_tw_is_path($path) && !isset($hidden[$path]) && !isset($urls[$path])) {
            $urls[$path] = $today;
        }
    }
    $origin = untrailingslashit(home_url());
    $out = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    foreach ($urls as $path => $lastmod) {
        $out .= '  <url><loc>' . esc_url($origin . $path) . '</loc>' . ($lastmod !== '' ? '<lastmod>' . esc_html($lastmod) . '</lastmod>' : '') . "</url>\n";
    }
    $out .= "</urlset>\n";
    $file = eco_gia_dir() . '/sitemap.xml';
    if (file_put_contents($file . '.tmp', $out) !== false) {
        rename($file . '.tmp', $file);
    }
}

/** Link trang hợp lệ: "/" hoặc /a/b/ (chữ thường không dấu, số, gạch) */
function eco_tw_is_path($path)
{
    return is_string($path) && ($path === '/' || preg_match('#^/[a-z0-9_-]+(?:/[a-z0-9_-]+)*/$#', $path)) && strlen($path) <= 200;
}

/** File HTML dựng sẵn của một trang (rỗng nếu giao diện mới không có trang đó) */
function eco_tw_static_file($path)
{
    if (!eco_tw_is_path($path)) {
        return '';
    }
    $file = __DIR__ . '/site' . $path . 'index.html';
    return is_readable($file) ? $file : '';
}

/**
 * SEO Ecopillo điền, theo link trang: danh mục Woo (danh-muc.php) rồi đè bằng dòng ở Nội dung web → "SEO từng trang"
 * (src/data/liveSeo.ts làm cùng thứ tự). @return array<string, array{tieuDe?: string, moTa?: string, anh?: string}>
 */
function eco_tw_seo_map($fresh = false)
{
    static $map = null;
    if ($map !== null && !$fresh) {
        return $map;
    }
    $map = function_exists('eco_dm_compute') ? eco_dm_compute()['seo'] : array();
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved('seo-tung-trang') : null;
    foreach ($saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array() as $row) {
        $path = isset($row['duongDan']) ? strtolower(trailingslashit(trim((string) $row['duongDan']))) : '';
        if (!eco_tw_is_path($path)) {
            continue;
        }
        $item = isset($map[$path]) ? $map[$path] : array();
        $title = isset($row['tieuDe']) ? eco_sp_text($row['tieuDe'], 200) : '';
        $desc = isset($row['moTa']) ? eco_sp_text($row['moTa'], 400) : '';
        $image = isset($row['anh']['src']) && eco_nd_is_link($row['anh']['src']) ? (string) $row['anh']['src'] : '';
        if ($title !== '') {
            $item['tieuDe'] = $title;
        }
        if ($desc !== '') {
            $item['moTa'] = $desc;
        }
        if ($image !== '') {
            $item['anh'] = $image;
        }
        if ($item) {
            $map[$path] = $item;
        }
    }
    return $map;
}

/** Ghi tiêu đề, mô tả, ảnh chia sẻ vào HTML (cùng cách tools/dung-san-html.mjs ghi lúc dựng); chữ đã thoát */
function eco_tw_head($html, $title, $desc, $image = '')
{
    $set = function ($html, $attr, $value) {
        return preg_replace('#(' . preg_quote($attr, '#') . '\s+content=")[^"]*(")#', '${1}' . str_replace(array('\\', '$'), array('\\\\', '\$'), esc_attr($value)) . '${2}', $html, 1);
    };
    if ($title !== '') {
        $html = preg_replace('#<title>[^<]*</title>#', '<title>' . str_replace(array('\\', '$'), array('\\\\', '\$'), esc_html($title)) . '</title>', $html, 1);
        $html = $set($html, 'property="og:title"', $title);
    }
    if ($desc !== '') {
        $html = $set($html, 'name="description"', $desc);
        $html = $set($html, 'property="og:description"', $desc);
    }
    if ($image !== '') {
        $html = $set($html, 'property="og:image"', $image);
        // Ảnh Ecopillo chọn không chắc 1200×630: bỏ kích thước khai sẵn (như dung-san-html.mjs làm với ảnh ngoài)
        $html = preg_replace('#\s*<meta property="og:image:(width|height)"[^>]*>#', '', $html);
    }
    return $html;
}

/** Trang đã gỡ → trang chuyển tới: danh mục ẩn / xoá (danh-muc.php), sản phẩm, mẫu, bài có sẵn đã gỡ (an-xoa.php) */
function eco_tw_hidden_map()
{
    $map = function_exists('eco_dm_compute') ? eco_dm_compute()['an'] : array();
    if (function_exists('eco_ax_compute')) {
        $map = array_merge(eco_ax_compute()['trang'], $map);
    }
    return $map;
}

/** Các trang cần WordPress trả (trang có sẵn đã đổi SEO, đã ẩn, có chuyển link Ecopillo thêm) */
function eco_tw_wanted_paths()
{
    $paths = array();
    $hidden = eco_tw_hidden_map();
    $redirects = function_exists('eco_nd_redirects') ? eco_nd_redirects() : array();
    foreach (array_merge(array_keys(eco_tw_seo_map(true)), array_keys($hidden), array_keys($redirects)) as $path) {
        if (eco_tw_static_file($path) !== '') {
            $paths[$path] = true;
        }
    }
    return array_keys($paths);
}

/** Ghi lại file đánh dấu: tạo cái cần, xoá cái thừa. Gọi cuối eco_dl_write */
function eco_tw_sync_markers()
{
    $dir = eco_tw_dir();
    if (!wp_mkdir_p($dir)) {
        return;
    }
    if (!is_file($dir . '/.htaccess')) {
        // Chỉ để máy chủ kiểm "có file không"; không ai cần mở các file này
        file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    }
    $wanted = array();
    foreach (eco_tw_wanted_paths() as $path) {
        $wanted[$dir . $path . 'index.html'] = true;
    }
    // Xoá đánh dấu không còn cần
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($iterator as $item) {
        $path = $item->getPathname();
        if ($item->isFile() && $item->getFilename() === 'index.html' && !isset($wanted[$path])) {
            unlink($path);
        } elseif ($item->isDir() && count(scandir($path)) <= 2) {
            rmdir($path);
        }
    }
    foreach (array_keys($wanted) as $file) {
        if (!is_file($file) && wp_mkdir_p(dirname($file))) {
            file_put_contents($file, "Ecopillo: trang nay do WordPress tra (SEO, an trang, chuyen link). Plugin ghi, khong sua tay.\n");
        }
    }
}

add_action('template_redirect', 'eco_tw_serve', -5);
function eco_tw_serve()
{
    if (!function_exists('eco_mm_visitor_sees_new') || !eco_mm_visitor_sees_new()) {
        return;
    }
    // Như quy tắc .htaccess: xem trước bài, tìm kiếm, công tắc thử để WordPress tự lo
    foreach (array('preview', 'preview_id', 'p', 'page_id', 's', 'giao-dien-moi') as $param) {
        if (isset($_GET[$param])) {
            return;
        }
    }
    $path = (string) parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
    $path = $path === '' ? '/' : $path;
    if (substr($path, -1) !== '/' || !eco_tw_is_path($path)) {
        return;
    }
    // Trang Ecopillo đã gỡ: danh mục ẩn / xoá, sản phẩm, mẫu, bài
    $hidden = eco_tw_hidden_map();
    if (isset($hidden[$path])) {
        wp_safe_redirect(home_url($hidden[$path]), 301, 'Ecopillo');
        exit;
    }
    $file = eco_tw_static_file($path);
    if ($file === '') {
        return;
    }
    $html = (string) file_get_contents($file);
    $seo = eco_tw_seo_map();
    if (isset($seo[$path])) {
        $item = $seo[$path];
        $html = eco_tw_head($html, isset($item['tieuDe']) ? $item['tieuDe'] : '', isset($item['moTa']) ? $item['moTa'] : '', isset($item['anh']) ? $item['anh'] : '');
    }
    status_header(200);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    echo $html; // trang tĩnh của giao diện mới, các chữ chèn vào đã thoát
    exit;
}

/* ---------------------------------------------------------------- Biểu tượng web, ảnh chia sẻ mặc định (src/data/siteIcons.ts) */

/** Đường dẫn trên đĩa của một ảnh trong Thư viện (link ảnh Ecopillo chọn); không phải ảnh Thư viện thì rỗng */
function eco_tw_media_path($url)
{
    $url = (string) $url;
    $id = $url !== '' ? attachment_url_to_postid($url) : 0;
    if ($id) {
        $file = get_attached_file($id);
        return $file && is_file($file) ? $file : '';
    }
    $uploads = wp_upload_dir(null, false);
    if ($url !== '' && strpos($url, $uploads['baseurl'] . '/') === 0) {
        $file = $uploads['basedir'] . substr($url, strlen($uploads['baseurl']));
        return is_file($file) && strpos(realpath($file), realpath($uploads['basedir'])) === 0 ? $file : '';
    }
    return '';
}

/**
 * Cắt ảnh Ecopillo chọn thành favicon-48.png, favicon.png (512), apple-touch-icon.png (180), og-image.jpg (1200×630) trong
 * uploads/ecopillo-du-lieu/tep/; quy tắc .htaccess trả các file này thay file dựng sẵn. Chưa chọn ảnh (hoặc trả về gốc) thì xoá.
 * Chỉ làm lại khi ảnh đổi.
 */
function eco_tw_write_files()
{
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved('bieu-tuong-web') : null;
    $value = $saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array();
    $signature = md5((string) wp_json_encode($value));
    if (get_option('ecopillo_tep_ban') === $signature) {
        return;
    }
    $dir = eco_gia_dir() . '/tep';
    if (!wp_mkdir_p($dir)) {
        return;
    }
    $targets = array(
        'favicon-48.png' => array('bieuTuong', 48, 48, 'image/png'),
        'favicon.png' => array('bieuTuong', 512, 512, 'image/png'),
        'apple-touch-icon.png' => array('bieuTuong', 180, 180, 'image/png'),
        'og-image.jpg' => array('anhChiaSe', 1200, 630, 'image/jpeg'),
    );
    foreach ($targets as $name => $spec) {
        $file = $dir . '/' . $name;
        $source = isset($value[$spec[0]]['src']) ? eco_tw_media_path($value[$spec[0]]['src']) : '';
        if ($source === '') {
            if (is_file($file)) {
                unlink($file); // ảnh gốc: dùng file dựng sẵn
            }
            continue;
        }
        $editor = wp_get_image_editor($source);
        if (is_wp_error($editor)) {
            continue;
        }
        $editor->resize($spec[1], $spec[2], true);
        $editor->set_quality(86);
        $editor->save($file, $spec[3]);
    }
    update_option('ecopillo_tep_ban', $signature, false);
}
