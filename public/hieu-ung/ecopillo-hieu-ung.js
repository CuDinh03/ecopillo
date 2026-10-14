/*!
 * Ecopillo · Hiệu ứng êm v1.0
 * - Hiện dần khi cuộn: một IntersectionObserver cho cả trang, mỗi phần tử chỉ chạy một lần.
 * - Ảnh trôi chậm: trình duyệt mới chạy bằng CSS; trình duyệt cũ cập nhật theo khung hình, chỉ cho ảnh đang thấy.
 * - Cuộn trôi: Lenis cho chuột và bàn di chuột trên máy tính. Điện thoại giữ cuộn gốc của máy.
 * Cần nạp lenis.min.js trước file này (thiếu Lenis thì chỉ bỏ phần cuộn trôi).
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var REVEAL = '.ecm-reveal, .ecm-reveal-left, .ecm-reveal-right, .ecm-fade, .ecm-stagger > *, [data-reveal]';
  // Vùng tự cuộn bên trong (menu điện thoại, giỏ hàng trượt, ô chọn tỉnh/thành, popup): để máy tự cuộn
  var NO_SMOOTH = '#wpadminbar, .select2-container, .select2-results, [role="dialog"], [aria-modal="true"], .ecm-no-smooth';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cssTimeline = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));

  var revealIO = null;
  var lenis = null;
  var off = false;
  var scanQueued = false;

  /* ---------- Hiện dần khi cuộn ---------- */

  function showAll() {
    document.querySelectorAll(REVEAL).forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if ('IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
  }

  function scanReveal() {
    if (!revealIO || off) return showAll();
    document.querySelectorAll(REVEAL).forEach(function (el) {
      if (!el.classList.contains('is-visible')) revealIO.observe(el);
    });
  }

  /* ---------- Ảnh trôi chậm (chỉ khi trình duyệt chưa hỗ trợ CSS) ---------- */

  var parallaxOn = [];
  var parallaxIO = null;
  var frame = 0;

  function drawParallax() {
    frame = 0;
    var vh = window.innerHeight;
    var reads = parallaxOn.map(function (box) {
      return box.getBoundingClientRect();
    });
    parallaxOn.forEach(function (box, i) {
      var r = reads[i];
      var p = (vh - r.top) / (vh + r.height); // 0 khi vừa ló ở đáy, 1 khi vừa khuất ở đỉnh
      p = Math.max(0, Math.min(1, p)) * 2 - 1;
      var img = box.firstElementChild;
      if (img) img.style.translate = '0 calc(var(--ecm-range) * ' + p.toFixed(4) + ')';
    });
  }

  function requestParallax() {
    if (!frame && parallaxOn.length) frame = requestAnimationFrame(drawParallax);
  }

  function scanParallax() {
    if (cssTimeline || !parallaxIO) return;
    document.querySelectorAll('.ecm-parallax').forEach(function (box) {
      if (!box.__ecm) {
        box.__ecm = 1;
        parallaxIO.observe(box);
      }
    });
  }

  function startParallax() {
    if (cssTimeline || parallaxIO || reduceMotion.matches || !('IntersectionObserver' in window)) return;
    parallaxIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = parallaxOn.indexOf(entry.target);
        if (entry.isIntersecting && i < 0) parallaxOn.push(entry.target);
        if (!entry.isIntersecting && i > -1) parallaxOn.splice(i, 1);
      });
      requestParallax();
    });
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax, { passive: true });
    scanParallax();
  }

  function stopParallax() {
    if (!parallaxIO) return;
    parallaxIO.disconnect();
    parallaxIO = null;
    parallaxOn = [];
    window.removeEventListener('scroll', requestParallax);
    window.removeEventListener('resize', requestParallax);
    document.querySelectorAll('.ecm-parallax').forEach(function (box) {
      box.__ecm = 0;
      if (box.firstElementChild) box.firstElementChild.style.translate = '';
    });
  }

  /* ---------- Cuộn trôi ---------- */

  function startSmooth() {
    if (lenis || off || typeof window.Lenis !== 'function' || reduceMotion.matches) return;
    if (doc.classList.contains('ecm-no-smooth')) return;
    lenis = new window.Lenis({
      lerp: 0.085,           // càng nhỏ càng "trôi"; 0.085 êm mà vẫn theo kịp tay
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,      // điện thoại: giữ cuộn gốc, không giật
      autoRaf: true,
      anchors: true,         // bấm link #muc cũng trôi tới, chừa chỗ cho menu (scroll-padding-top)
      stopInertiaOnNavigate: true,
      prevent: function (node) {
        return node.matches ? node.matches(NO_SMOOTH) : false;
      }
    });
  }

  function stopSmooth() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
  }

  /* ---------- Khởi động ---------- */

  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(function () {
      scanQueued = false;
      scanReveal();
      scanParallax();
    });
  }

  function init() {
    scanReveal();
    startParallax();
    startSmooth();
    doc.classList.add('ecm-ready');

    // Nội dung nạp thêm sau (lọc sản phẩm, "xem thêm" của WooCommerce) cũng có hiệu ứng
    if ('MutationObserver' in window) {
      new MutationObserver(queueScan).observe(document.body, { childList: true, subtree: true });
    }

    var onReduceChange = function () {
      if (reduceMotion.matches) {
        stopSmooth();
        stopParallax();
      } else if (!off) {
        startSmooth();
        startParallax();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onReduceChange);

    window.addEventListener('beforeprint', showAll);
  }

  window.ecoMotion = {
    /** Quét lại trang sau khi tự chèn nội dung bằng JS */
    refresh: queueScan,
    /** Lenis đang chạy (hoặc null): ecoMotion.lenis().stop() khi mở menu, .start() khi đóng */
    lenis: function () {
      return lenis;
    },
    smooth: function (on) {
      if (on) {
        doc.classList.remove('ecm-no-smooth');
        startSmooth();
      } else {
        doc.classList.add('ecm-no-smooth');
        stopSmooth();
      }
    },
    disable: function () {
      off = true;
      doc.classList.add('ecm-off');
      stopSmooth();
      stopParallax();
      showAll();
    },
    enable: function () {
      off = false;
      doc.classList.remove('ecm-off');
      startParallax();
      startSmooth();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
