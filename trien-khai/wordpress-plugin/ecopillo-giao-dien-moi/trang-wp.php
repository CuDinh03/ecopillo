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
 * - link Ecopillo thêm ở "Chuyển hướng link" mà đang là một trang có sẵn: eco_nd_redirect (noi-dung.php) trả 301 trước;
 * - trang Ecopillo đổi link ở "Đổi link trang" (src/data/pageAliases.ts): link cũ trả 301 sang link mới. Link mới không có file
 *   trong site/ nên quy tắc .htaccess để WordPress trả (không cần đánh dấu): plugin trả HTML dựng sẵn của trang với canonical,
 *   og:url, link trong trang đổi sang link mới.
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
    // Trang Ecopillo đã đổi link: sơ đồ ghi link mới (giữ ngày sửa của trang)
    $aliases = eco_tw_aliases();
    $urls = array();
    foreach ($m as $row) {
        $path = (string) parse_url(html_entity_decode($row[1]), PHP_URL_PATH);
        if ($path !== '' && !isset($hidden[$path])) {
            $urls[isset($aliases[$path]) ? $aliases[$path] : $path] = isset($row[2]) ? $row[2] : '';
        }
    }
    $today = current_time('Y-m-d');
    foreach (eco_tw_created_paths() as $path) {
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

/** Link các trang Ecopillo tạo sau lần dựng: danh mục mới, bộ sưu tập mới, mẫu mới, sản phẩm mới, bài mới */
function eco_tw_created_paths()
{
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
    return $add;
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
    // Bài viết dựng sẵn Ecopillo đổi tiêu đề, mô tả, ảnh bìa; dòng "SEO từng trang" bên dưới vẫn đứng trên
    foreach (eco_tw_code_posts()['seo'] as $path => $item) {
        $map[$path] = array_merge(isset($map[$path]) ? $map[$path] : array(), $item);
    }
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

/**
 * Bài viết dựng sẵn trong code (src/data/posts.ts, 3 bài không nằm trong mục Bài viết) Ecopillo sửa ở Nội dung web →
 * "Bài viết dựng sẵn": bộ khoá "bai-dung-san-<tên bài>" (src/data/codePostKeys.ts).
 * - Chọn "Ẩn": link bài chuyển (301) về trang Tin tức, bỏ khỏi sitemap;
 * - Đổi tiêu đề, giới thiệu / mô tả Google, ảnh bìa: ghi vào HTML dựng sẵn trả về (như "SEO từng trang").
 * @return array{an: array<string, string>, seo: array<string, array{tieuDe?: string, moTa?: string, anh?: string}>}
 */
function eco_tw_code_posts()
{
    $result = array('an' => array(), 'seo' => array());
    if (!function_exists('eco_nd_sets') || !function_exists('eco_nd_saved')) {
        return $result;
    }
    $frame = function_exists('eco_gia_frame') ? eco_gia_frame() : array();
    $blog = isset($frame['trangTinTuc']) && eco_tw_is_path((string) $frame['trangTinTuc']) ? (string) $frame['trangTinTuc'] : '/category/tin-tuc/';
    foreach (eco_nd_sets() as $key => $set) {
        if (!preg_match('/^bai-dung-san-([a-z0-9-]{1,120})$/', (string) $key, $m)) {
            continue;
        }
        $saved = eco_nd_saved($key);
        if (!$saved || !is_array($saved['giaTri'])) {
            continue;
        }
        $path = '/' . $m[1] . '/';
        $value = $saved['giaTri'];
        $goc = is_array($set['goc']) ? $set['goc'] : array();
        if (isset($value['hien']) && $value['hien'] === 'khong') {
            $result['an'][$path] = $blog;
            continue;
        }
        $pick = function ($source, $field, $max) {
            return isset($source[$field]) && is_string($source[$field]) && function_exists('eco_sp_text') ? eco_sp_text($source[$field], $max) : '';
        };
        $item = array();
        // Tiêu đề tab như usePageMeta: "<tiêu đề bài> · Ecopillo"
        $title = $pick($value, 'tieuDe', 200);
        if ($title !== '' && $title !== $pick($goc, 'tieuDe', 200)) {
            $item['tieuDe'] = $title . ' · Ecopillo';
        }
        // Mô tả Google: ô "Mô tả trên Google", trống thì đoạn giới thiệu (như ArticlePage.tsx)
        $desc = $pick($value, 'moTaGoogle', 400);
        $desc = $desc !== '' ? $desc : $pick($value, 'gioiThieu', 400);
        $goc_desc = $pick($goc, 'moTaGoogle', 400);
        $goc_desc = $goc_desc !== '' ? $goc_desc : $pick($goc, 'gioiThieu', 400);
        if ($desc !== '' && $desc !== $goc_desc) {
            $item['moTa'] = $desc;
        }
        // Ảnh bìa mới từ Thư viện (link đầy đủ): ảnh chia sẻ
        $image = isset($value['anhBia']['src']) ? trim((string) $value['anhBia']['src']) : '';
        $goc_image = isset($goc['anhBia']['src']) ? (string) $goc['anhBia']['src'] : '';
        if ($image !== $goc_image && preg_match('#^https?://#', $image) && eco_nd_is_link($image)) {
            $item['anh'] = $image;
        }
        if ($item) {
            $result['seo'][$path] = $item;
        }
    }
    return $result;
}

/**
 * Trang chính sách có sẵn Ecopillo ẩn ở Nội dung web → "Đầu các trang chính sách" (đợt I; src/data/policyKeys.ts làm cùng cách):
 * dòng chọn "Ẩn", hoặc bộ đã lưu mà không còn dòng của trang đó. Chưa lưu bộ thì không ẩn trang nào. Link cũ mở nội dung
 * trang đó (khung giá: chinhSachLinkCu) cũng chuyển. @return array<string, string> link trang → trang Hỏi đáp
 */
function eco_tw_policy_hidden()
{
    $sets = function_exists('eco_nd_sets') ? eco_nd_sets() : array();
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved('chinh-sach-dau-trang') : null;
    if (!isset($sets['chinh-sach-dau-trang']) || !$saved || !is_array($saved['giaTri'])) {
        return array();
    }
    $slugs = array();
    foreach ((array) $sets['chinh-sach-dau-trang']['truong'] as $field) {
        if (isset($field['khoa']) && $field['khoa'] === 'slug' && isset($field['luaChon'])) {
            $slugs = array_map('strval', (array) $field['luaChon']);
        }
    }
    // Dòng trên thắng khi hai dòng cùng trang; dòng lưu trước đợt I chưa có ô Hiện / Ẩn là đang hiện
    $show = array();
    foreach ($saved['giaTri'] as $row) {
        $slug = is_array($row) && isset($row['slug']) ? sanitize_title((string) $row['slug']) : '';
        if ($slug !== '' && !isset($show[$slug])) {
            $show[$slug] = !isset($row['hien']) || $row['hien'] !== 'khong';
        }
    }
    $frame = function_exists('eco_gia_frame') ? eco_gia_frame() : array();
    $faq = isset($frame['trangHoiDap']) && eco_tw_is_path((string) $frame['trangHoiDap']) ? (string) $frame['trangHoiDap'] : '/hoi-dap/';
    $aliases = isset($frame['chinhSachLinkCu']) ? (array) $frame['chinhSachLinkCu'] : array();
    $map = array();
    foreach ($slugs as $slug) {
        if (!empty($show[$slug])) {
            continue;
        }
        $map['/' . $slug . '/'] = $faq;
        foreach ($aliases as $alias => $target) {
            if ((string) $target === $slug && preg_match('/^[a-z0-9-]{1,200}$/', (string) $alias)) {
                $map['/' . $alias . '/'] = $faq;
            }
        }
    }
    return $map;
}

/**
 * Trang đã gỡ → trang chuyển tới: danh mục ẩn / xoá (danh-muc.php), sản phẩm, mẫu, bài có sẵn đã gỡ (an-xoa.php),
 * bài viết dựng sẵn Ecopillo chọn "Ẩn" ở Nội dung web (eco_tw_code_posts), trang chính sách đã ẩn (eco_tw_policy_hidden)
 */
function eco_tw_hidden_map()
{
    $map = function_exists('eco_dm_compute') ? eco_dm_compute()['an'] : array();
    if (function_exists('eco_ax_compute')) {
        $map = array_merge(eco_ax_compute()['trang'], $map);
    }
    return array_merge(eco_tw_policy_hidden(), eco_tw_code_posts()['an'], $map);
}

/* ---------------------------------------------------------------- Đổi link trang có sẵn (src/data/pageAliases.ts) */

/** Mã bộ "Đổi link trang" ở Nội dung web → Giao diện (src/data/pageAliasFrame.ts) */
define('ECO_TW_ALIAS_SET', 'doi-link-trang');

/**
 * Link Ecopillo gõ ở ô "Link mới" → dạng chuẩn: bỏ tên miền của web, bỏ dấu, chữ thường, gạch ngang thay khoảng trắng,
 * "/" hai đầu ("Về Ecopillo" → "/ve-ecopillo/"). Link sang web khác giữ nguyên để bước kiểm báo lỗi.
 */
function eco_tw_alias_normalize($link)
{
    $link = trim((string) $link);
    $home = untrailingslashit(home_url());
    $host = (string) wp_parse_url($home, PHP_URL_HOST);
    if ($link !== '' && stripos($link, $home . '/') === 0) {
        $link = substr($link, strlen($home));
    } elseif ($host !== '' && preg_match('#^(?:www\.)?' . preg_quote($host, '#') . '(/.*)?$#i', $link, $m)) {
        $link = isset($m[1]) ? $m[1] : ''; // gõ tên miền không có https://
    } elseif (preg_match('#^[a-z][a-z0-9+.-]*:#i', $link) || strpos($link, '//') === 0) {
        return $link;
    }
    $link = (string) preg_replace('/[?#].*$/s', '', $link);
    $parts = array();
    foreach (explode('/', $link) as $part) {
        $part = sanitize_title(remove_accents(rawurldecode($part)));
        if ($part !== '') {
            $parts[] = $part;
        }
    }
    return $parts ? '/' . implode('/', $parts) . '/' : ($link === '' ? '' : '/');
}

/** Link máy chủ đang trả 301 theo quy tắc .htaccess (linkDaCo trong noi-dung-goc.json, sinh từ HOST_REDIRECTS) */
function eco_tw_alias_reserved()
{
    $sets = function_exists('eco_nd_sets') ? eco_nd_sets() : array();
    $list = isset($sets[ECO_TW_ALIAS_SET]['linkDaCo']) ? (array) $sets[ECO_TW_ALIAS_SET]['linkDaCo'] : array();
    return array_flip(array_map('strval', $list));
}

/** Link cũ các dòng Ecopillo ghi ở "Chuyển hướng link" (bản đã lưu, chưa lọc), cùng cách chuẩn hoá như eco_nd_redirects */
function eco_tw_redirect_sources()
{
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved('chuyen-huong') : null;
    $out = array();
    foreach ($saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array() as $row) {
        if (is_array($row) && isset($row['tu']) && (string) $row['tu'] !== '') {
            $out[strtolower(trailingslashit((string) $row['tu']))] = true;
        }
    }
    return $out;
}

/**
 * Lỗi của một dòng đổi link (chữ rỗng = dòng dùng được). $saving: kiểm thêm phần chỉ có ý nghĩa lúc Ecopillo bấm Lưu (trùng bài,
 * trang WordPress, trang Ecopillo tạo, dòng "Chuyển hướng link"). Lúc đọc chỉ kiểm phần chắc chắn, để thứ thêm sau (bài mới,
 * dòng chuyển hướng mới) không làm trang đang chạy ở link mới bỗng mất: "Đổi link trang" đứng trên (eco_nd_redirects bỏ dòng trùng).
 */
function eco_tw_alias_problem($from, $to, $saving)
{
    if (!eco_tw_is_path($from) || $from === '/' || eco_tw_static_file($from) === '') {
        return 'không có trang này trên giao diện mới';
    }
    if ($to === '') {
        return 'chưa ghi link mới';
    }
    if (strlen($to) > 200 || !preg_match('#^/[a-z0-9-]+(?:/[a-z0-9-]+)*/$#', $to)) {
        return 'link mới chỉ gồm chữ thường không dấu, số, gạch ngang, có "/" hai đầu (ví dụ /ve-ecopillo/)';
    }
    if ($to === $from) {
        return 'link mới trùng link đang dùng';
    }
    // Đầu link dành cho WordPress và file của web (như RESERVED_FIRST trong pageAliases.ts)
    if (preg_match('#^/(?:wp-[^/]*|api|feed|comments|embed|page|search|assets|fonts|images|hieu-ung)/#', $to)) {
        return 'link mới bắt đầu bằng phần dành cho WordPress hoặc file của web';
    }
    if (eco_tw_static_file($to) !== '') {
        return 'link mới trùng một trang có sẵn của web';
    }
    $reserved = eco_tw_alias_reserved();
    $hidden = eco_tw_hidden_map();
    if (isset($reserved[$to]) || isset($hidden[$to])) {
        return 'link mới đang tự chuyển (301) sang trang khác';
    }
    if (!$saving) {
        return '';
    }
    if (in_array($to, eco_tw_created_paths(), true)) {
        return 'link mới trùng một trang Ecopillo đã tạo (danh mục, bộ sưu tập, sản phẩm, bài viết mới)';
    }
    if (url_to_postid(home_url($to)) > 0) {
        return 'link mới trùng một bài viết, trang hoặc sản phẩm trong WordPress';
    }
    if (preg_match('#^/(danh-muc-san-pham|category)/(?:.+/)?([a-z0-9-]+)/$#', $to, $m) && term_exists($m[2], $m[1] === 'category' ? 'category' : 'product_cat')) {
        return 'link mới trùng một danh mục trong WordPress';
    }
    $sources = eco_tw_redirect_sources();
    if (isset($sources[$from]) || isset($sources[$to])) {
        return 'link này đang có dòng ở Nội dung web → Chuyển hướng link; xoá dòng đó trước';
    }
    return '';
}

/**
 * Kiểm các dòng đổi link. @return array{map: array<string, string>, loi: string[]} map: link cũ → link mới đã kiểm;
 * loi: lỗi từng dòng để màn hình sửa báo (dòng lỗi bị bỏ)
 */
function eco_tw_alias_check($rows, $saving = false)
{
    $map = array();
    $news = array();
    $errors = array();
    foreach (is_array($rows) ? $rows : array() as $row) {
        if (!is_array($row)) {
            continue;
        }
        $from = isset($row['trang']) ? strtolower(trailingslashit(trim((string) $row['trang']))) : '';
        $to = isset($row['linkMoi']) ? strtolower(trim((string) $row['linkMoi'])) : '';
        $to = $to !== '' && substr($to, -1) !== '/' ? $to . '/' : $to;
        $problem = eco_tw_alias_problem($from, $to, $saving);
        if ($problem === '' && isset($map[$from])) {
            $problem = 'trang này đã có một dòng đổi link khác';
        }
        if ($problem === '' && isset($news[$to])) {
            $problem = 'hai trang cùng một link mới';
        }
        if ($problem !== '') {
            $errors[] = ($to !== '' ? $to : $from) . ': ' . $problem;
            continue;
        }
        $map[$from] = $to;
        $news[$to] = $from;
    }
    // Đổi nối tiếp (link mới của trang này là link cũ của trang khác): bỏ cả hai phía, như pageAliases.ts
    foreach ($map as $from => $to) {
        if (isset($map[$to]) || isset($news[$from])) {
            $errors[] = $to . ': link mới đang là link cũ của một trang khác cũng đổi link (đổi nối tiếp)';
            unset($map[$from]);
        }
    }
    return array('map' => $map, 'loi' => $errors);
}

/** Link cũ → link mới của các trang Ecopillo đã đổi link (bản đã lưu, kiểm lại mỗi lần đọc) */
function eco_tw_aliases()
{
    static $cache = array();
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved(ECO_TW_ALIAS_SET) : null;
    $rows = $saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array();
    if (!$rows) {
        return array();
    }
    $signature = md5((string) wp_json_encode($rows));
    if (!isset($cache[$signature])) {
        $cache[$signature] = eco_tw_alias_check($rows)['map'];
    }
    return $cache[$signature];
}

/** Link khách thấy của một trang (link mới nếu Ecopillo đã đổi link), giữ ?…, #… phía sau */
function eco_tw_public_path($path)
{
    $path = (string) $path;
    $aliases = eco_tw_aliases();
    if (!$aliases || !preg_match('/^([^?#]*)(.*)$/s', $path, $m)) {
        return $path;
    }
    $key = strtolower(trailingslashit($m[1]));
    return isset($aliases[$key]) ? $aliases[$key] . $m[2] : $path;
}

/**
 * HTML dựng sẵn trả từ WordPress: link tới trang đã đổi link (href trong trang, canonical, og:url, link trong JSON-LD) đổi sang
 * link mới, để Google đọc đúng link chính mà không phải đi qua 301. Chỉ đổi link nguyên vẹn (theo sau là " # ?).
 */
function eco_tw_alias_html($html, $aliases)
{
    if (!$aliases) {
        return $html;
    }
    $origin = preg_match('#<link rel="canonical" href="(https?://[^/"]+)#', $html, $m) ? $m[1] : untrailingslashit(home_url());
    foreach ($aliases as $from => $to) {
        $pattern = '#(href="|content="|":")(' . preg_quote($origin, '#') . ')?' . preg_quote($from, '#') . '(?=["\#?])#';
        $html = (string) preg_replace($pattern, '${1}${2}' . $to, $html);
    }
    return $html;
}

/**
 * Lưu xong "Đổi link trang" (cả khôi phục, trả về gốc): xoá bộ nhớ đệm trang của LiteSpeed Cache (nếu có), để link mới không còn
 * trả trang lỗi đã lưu đệm từ trước, link cũ không còn trả trang cũ (như lúc đổi chế độ, ecopillo-giao-dien-moi.php)
 */
add_action('eco_nd_da_luu', 'eco_tw_alias_after_save');
function eco_tw_alias_after_save($key)
{
    if ($key === ECO_TW_ALIAS_SET) {
        do_action('litespeed_purge_all');
    }
}

/** Lưu "Đổi link trang": chuẩn hoá ô Link mới trước khi kiểm từng ô (noi-dung-quan-tri.php, eco_nd_save) */
add_filter('eco_nd_truoc_luu', 'eco_tw_alias_before_save', 10, 2);
function eco_tw_alias_before_save($raw, $key)
{
    if ($key !== ECO_TW_ALIAS_SET || !is_array($raw)) {
        return $raw;
    }
    foreach ($raw as $i => $row) {
        if (is_array($row) && isset($row['linkMoi'])) {
            $raw[$i]['linkMoi'] = eco_tw_alias_normalize($row['linkMoi']);
        }
    }
    return $raw;
}

/**
 * Lưu "Đổi link trang" (link mới trùng trang khác, bài WordPress, link đang 301, đổi nối tiếp…) hoặc "Chuyển hướng link"
 * (link cũ / link mới của trang đã đổi link): có lỗi thì không lưu, màn hình sửa báo từng dòng
 */
add_filter('eco_nd_kiem_luu', 'eco_tw_alias_save_errors', 10, 3);
function eco_tw_alias_save_errors($errors, $key, $value)
{
    $errors = (array) $errors;
    if ($key === ECO_TW_ALIAS_SET) {
        return array_merge($errors, eco_tw_alias_check($value, true)['loi']);
    }
    if ($key === 'chuyen-huong') {
        $aliases = eco_tw_aliases();
        foreach (is_array($value) ? $value : array() as $row) {
            $from = is_array($row) && isset($row['tu']) ? strtolower(trailingslashit((string) $row['tu'])) : '';
            if ($from !== '' && (isset($aliases[$from]) || in_array($from, $aliases, true))) {
                $errors[] = $from . ': trang này đã đổi link ở Nội dung web → Đổi link trang (link cũ tự chuyển sang link mới)';
            }
        }
    }
    return $errors;
}

/**
 * Các trang cần WordPress trả (trang có sẵn đã đổi SEO, đã ẩn, có chuyển link Ecopillo thêm, có khối tự do, link cũ của trang đã
 * đổi link). Link mới của trang đã đổi link không cần đánh dấu: không có file trong site/ nên .htaccess đã để WordPress trả.
 */
function eco_tw_wanted_paths()
{
    $paths = array();
    $hidden = eco_tw_hidden_map();
    $redirects = function_exists('eco_nd_redirects') ? eco_nd_redirects() : array();
    // Trang có khối tự do (đợt H): WordPress trả để ghi sẵn khối vào HTML
    foreach (array_merge(array_keys(eco_tw_seo_map(true)), array_keys($hidden), array_keys($redirects), array_keys(eco_tw_free_blocks()), array_keys(eco_tw_aliases())) as $path) {
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

/**
 * Trang không tìm thấy (25/11/2026, sau khi cài 2.2.0 lên web thật thấy link không tồn tại vẫn ra trang lỗi của giao diện WordPress cũ):
 * WordPress báo 404 mà khách đang thấy giao diện mới thì trả site/404.html của giao diện mới, giữ mã 404 (Google không lập chỉ mục).
 * Trang này nạp du-lieu.js như mọi trang, nên chữ, bố cục trang 404 và khối tự do đặt ở 404 Ecopillo sửa đều có tác dụng.
 * Chạy muộn (99) để plugin chuyển hướng khác (Yoast, Redirection…) và các trang khung của plugin này xử lý trước.
 */
add_action('template_redirect', 'eco_tw_serve_404', 99);
function eco_tw_serve_404()
{
    if (!is_404() || is_admin() || wp_doing_ajax() || is_feed() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return;
    }
    if (!function_exists('eco_mm_visitor_sees_new') || !eco_mm_visitor_sees_new()) {
        return;
    }
    foreach (array('preview', 'preview_id', 'p', 'page_id', 's', 'giao-dien-moi') as $param) {
        if (isset($_GET[$param])) {
            return;
        }
    }
    $file = __DIR__ . '/site/404.html';
    $html = is_readable($file) ? (string) file_get_contents($file) : '';
    if ($html === '') {
        return;
    }
    status_header(404);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Robots-Tag: noindex');
    echo $html; // trang tĩnh của giao diện mới, không chèn chữ nào từ yêu cầu
    exit;
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
    // Trang Ecopillo đã đổi link (eco_tw_aliases): link cũ → 301 link mới, giữ phần ?… (bộ lọc trang Sản phẩm, mã đo quảng cáo)
    $aliases = eco_tw_aliases();
    $query = isset($_SERVER['QUERY_STRING']) && (string) $_SERVER['QUERY_STRING'] !== '' ? '?' . (string) $_SERVER['QUERY_STRING'] : '';
    if ($aliases && substr($path, -1) !== '/' && eco_tw_is_path($path . '/')) {
        // Gõ thiếu "/" cuối (link cũ hoặc link mới): đưa thẳng về link mới, không để WordPress đoán sang bài khác
        $slashed = $path . '/';
        $to = isset($aliases[$slashed]) ? $aliases[$slashed] : (in_array($slashed, $aliases, true) ? $slashed : '');
        if ($to !== '') {
            wp_safe_redirect(home_url($to) . $query, 301, 'Ecopillo');
            exit;
        }
    }
    if (substr($path, -1) !== '/' || !eco_tw_is_path($path)) {
        return;
    }
    // Link mới của trang đã đổi link: trả trang dựng sẵn ở link cũ ($source)
    $source = array_search($path, $aliases, true);
    $source = $source !== false ? (string) $source : $path;
    // Trang Ecopillo đã gỡ: danh mục ẩn / xoá, sản phẩm, mẫu, bài (cả link cũ lẫn link mới, chuyển thẳng một lần)
    $hidden = eco_tw_hidden_map();
    if (isset($hidden[$source])) {
        wp_safe_redirect(home_url(eco_tw_public_path($hidden[$source])), 301, 'Ecopillo');
        exit;
    }
    if (isset($aliases[$path])) {
        wp_safe_redirect(home_url($aliases[$path]) . $query, 301, 'Ecopillo');
        exit;
    }
    $file = eco_tw_static_file($source);
    if ($file === '') {
        return;
    }
    $html = (string) file_get_contents($file);
    $seo = eco_tw_seo_map();
    // Dòng SEO ghi theo link mới đứng trên dòng ghi theo link cũ (như usePageMeta.ts)
    $seo_key = isset($seo[$path]) ? $path : $source;
    if (isset($seo[$seo_key])) {
        $item = $seo[$seo_key];
        $html = eco_tw_head($html, isset($item['tieuDe']) ? $item['tieuDe'] : '', isset($item['moTa']) ? $item['moTa'] : '', isset($item['anh']) ? $item['anh'] : '');
    }
    $html = eco_tw_put_free_blocks($html, $source);
    $html = eco_tw_alias_html($html, $aliases);
    status_header(200);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    echo $html; // trang tĩnh của giao diện mới, các chữ chèn vào đã thoát
    exit;
}

/* ---------------------------------------------------------------- Khối tự do ghi sẵn vào HTML (đợt H) */

/**
 * Khối tự do Ecopillo thêm ở Nội dung web → Giao diện → Khối tự do (src/data/freeBlocks.ts) do trình duyệt vẽ, nên HTML dựng sẵn
 * không có. Để Google (và mọi máy đọc không chạy JavaScript) thấy ngay chữ, ảnh, nút của khối: trang có khối tự do được đánh dấu
 * cho WordPress trả, và eco_tw_serve ghi bản đơn giản của các khối ngay trước chân trang. Trình duyệt vẽ lại cả trang theo
 * dữ liệu Ecopillo (main.tsx) nên khối về đúng chỗ, đúng kiểu; bản ghi sẵn nằm sát chân trang để không làm xô phần đầu trang.
 * Trang nào dùng bố cục nào: du-lieu/bo-cuc-trang.json (tools/dung-san-html.mjs ghi lúc dựng).
 */
function eco_tw_layout_paths()
{
    static $map = null;
    if ($map === null) {
        $file = __DIR__ . '/du-lieu/bo-cuc-trang.json';
        $data = is_readable($file) ? json_decode((string) file_get_contents($file), true) : null;
        $map = is_array($data) ? $data : array();
    }
    return $map;
}

/** Link trang → các khối tự do đang hiện của trang đó (theo thứ tự trong bộ Khối tự do). @return array<string, array> */
function eco_tw_free_blocks()
{
    $saved = function_exists('eco_nd_saved') ? eco_nd_saved('khoi-tu-do') : null;
    $rows = $saved && is_array($saved['giaTri']) ? $saved['giaTri'] : array();
    $layouts = eco_tw_layout_paths();
    $out = array();
    foreach ($rows as $row) {
        if (!is_array($row) || (isset($row['hien']) && $row['hien'] === 'khong') || empty($row['viTri']) || !is_array($row['viTri'])) {
            continue;
        }
        // "Chỉ hiện ở các trang này" (đợt I): chuẩn hoá như pagePath ở src/data/freeBlocks.ts
        $only = array();
        foreach (isset($row['chiTrang']) && is_array($row['chiTrang']) ? $row['chiTrang'] : array() as $raw) {
            $path = strtolower((string) preg_replace('#^https?://[^/]+#i', '', trim((string) $raw)));
            $path = (string) preg_replace('/[?#].*$/', '', $path);
            $path = substr($path, -1) === '/' ? $path : $path . '/';
            if (eco_tw_is_path($path)) {
                $only[$path] = true;
            }
        }
        $paths = array();
        foreach ($row['viTri'] as $place) {
            $key = strstr((string) $place, '@', true);
            foreach ($key !== false && isset($layouts[$key]) && is_array($layouts[$key]) ? $layouts[$key] : array() as $path) {
                if (eco_tw_is_path($path) && (!$only || isset($only[$path]))) {
                    $paths[$path] = true;
                }
            }
        }
        foreach (array_keys($paths) as $path) {
            $out[$path][] = $row;
        }
    }
    return $out;
}

/** Bản HTML đơn giản của các khối (chữ đã thoát, link / ảnh đã kiểm); lớp CSS là lớp sẵn có của giao diện mới */
function eco_tw_free_html($rows)
{
    $text = function ($value, $max) {
        return is_string($value) && function_exists('eco_sp_text') ? eco_sp_text($value, $max) : '';
    };
    $html = '';
    foreach ($rows as $row) {
        $title = str_replace('|', ' ', $text(isset($row['tieuDe']) ? $row['tieuDe'] : '', 300));
        $label = $text(isset($row['nhan']) ? $row['nhan'] : '', 200);
        $inner = '';
        if ($label !== '') {
            $inner .= '<p class="eyebrow">' . esc_html($label) . '</p>';
        }
        if ($title !== '') {
            $inner .= '<h2 class="font-display mt-3 text-[1.9rem] leading-[1.12] text-deep-900">' . esc_html($title) . '</h2>';
        }
        foreach (isset($row['doan']) && is_array($row['doan']) ? $row['doan'] : array() as $para) {
            $para = is_string($para) ? trim(sanitize_textarea_field($para)) : '';
            if ($para !== '') {
                $inner .= '<p class="mt-4 text-body leading-relaxed text-ink-soft">' . nl2br(esc_html($para)) . '</p>';
            }
        }
        $src = isset($row['anh']['src']) ? (string) $row['anh']['src'] : '';
        if ($src !== '' && eco_nd_is_link($src) && $src[0] !== '#') {
            $alt = $text(isset($row['anh']['alt']) ? $row['anh']['alt'] : '', 300);
            $inner .= '<img class="mt-6 w-full max-w-3xl rounded-[1.75rem] object-cover" loading="lazy" src="' . esc_url($src) . '" alt="' . esc_attr($alt) . '">';
        }
        $images = isset($row['dsAnh']) && is_array($row['dsAnh']) ? array_slice($row['dsAnh'], 0, 8) : array();
        $list = '';
        foreach ($images as $image) {
            if (is_string($image) && eco_nd_is_link($image) && $image[0] !== '#') {
                $list .= '<li><img class="aspect-square w-full rounded-2xl object-cover" loading="lazy" src="' . esc_url($image) . '" alt="' . esc_attr($title) . '"></li>';
            }
        }
        if ($list !== '') {
            $inner .= '<ul class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">' . $list . '</ul>';
        }
        $cards = '';
        foreach (isset($row['the']) && is_array($row['the']) ? $row['the'] : array() as $card) {
            $head = is_array($card) ? $text(isset($card['tieuDe']) ? $card['tieuDe'] : '', 300) : '';
            $body = is_array($card) ? $text(isset($card['moTa']) ? $card['moTa'] : '', 1000) : '';
            if ($head !== '' || $body !== '') {
                $cards .= '<li class="rounded-[1.5rem] bg-ivory p-6"><h3 class="font-display text-[1.3rem] text-deep-900">' . esc_html($head) . '</h3><p class="mt-2 text-body-sm text-ink-soft">' . esc_html($body) . '</p></li>';
            }
        }
        if ($cards !== '') {
            $inner .= '<ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">' . $cards . '</ul>';
        }
        $buttons = '';
        foreach (isset($row['nut']) && is_array($row['nut']) ? $row['nut'] : array() as $button) {
            $words = is_array($button) ? $text(isset($button['chu']) ? $button['chu'] : '', 120) : '';
            $link = is_array($button) && isset($button['link']) ? trim((string) $button['link']) : '';
            if ($words !== '' && eco_nd_is_link($link)) {
                $href = $link[0] === '#' ? $link : esc_url($link);
                $buttons .= '<a class="inline-flex h-12 items-center rounded-full bg-deep-800 px-6 text-body-sm font-medium text-ivory" href="' . esc_attr($href) . '">' . esc_html($words) . '</a>';
            }
        }
        if ($buttons !== '') {
            $inner .= '<div class="mt-7 flex flex-wrap gap-3">' . $buttons . '</div>';
        }
        if ($inner !== '') {
            $html .= '<section class="py-12" data-khoi-tu-do=""><div class="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">' . $inner . '</div></section>';
        }
    }
    return $html;
}

/** Ghi các khối tự do của trang vào HTML, ngay trước chân trang (không có chân trang thì cuối khung #root) */
function eco_tw_put_free_blocks($html, $path)
{
    $blocks = eco_tw_free_blocks();
    if (empty($blocks[$path])) {
        return $html;
    }
    $add = eco_tw_free_html($blocks[$path]);
    if ($add === '') {
        return $html;
    }
    // Chân trang web là thẻ footer cuối (thân bài có thể có footer của trích dẫn)
    $at = strrpos($html, '<footer');
    if ($at === false) {
        $root = strpos($html, '<div id="root">');
        $at = $root === false ? false : strpos($html, '</div>', $root);
    }
    return $at === false ? $html : substr($html, 0, $at) . $add . substr($html, $at);
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
