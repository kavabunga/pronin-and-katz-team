jQuery(document).ready(function ($) {
  var articlesWrapper = $('.cd-articles');

  if (articlesWrapper.length > 0) {
    // cache jQuery objects
    var windowHeight = $(window).height(),
      articles = articlesWrapper.find('article'),
      aside = $('.cd-read-more'),
      articleSidebarLinks = aside.find('li');
    // initialize variables
    var scrolling = false,
      mq = checkMQ(),
      svgCircleLength = parseInt(
        Math.PI * (articleSidebarLinks.eq(0).find('circle').attr('r') * 2),
      );

    // check media query and bind corresponding events
    if (mq == 'desktop') {
      $(window).on('resize', checkMenuState);
    }
    $(window).on('scroll', checkRead);

    updateArticle();

    aside.on('click', 'a', function (event) {
      event.preventDefault();
      var selectedArticle = articles.eq($(this).parent('li').index()),
        selectedArticleTop = selectedArticle.offset().top;

      $(window).off('scroll', checkRead);

      $('body,html').animate(
        { scrollTop: selectedArticleTop + 2 },
        300,
        function () {
          checkRead();
          $(window).on('scroll', checkRead);
        },
      );
    });
  }

  function checkRead() {
    if (!scrolling) {
      scrolling = true;
      !window.requestAnimationFrame
        ? setTimeout(updateArticle, 300)
        : window.requestAnimationFrame(updateArticle);
    }
  }

  function updateArticle() {
    var scrollTop = $(window).scrollTop();

    articles.each(function () {
      var article = $(this),
        articleTop = article.offset().top,
        articleHeight = article.outerHeight(),
        articleSidebarLink = articleSidebarLinks
          .eq(article.index())
          .children('a');

      if (article.is(':last-of-type'))
        articleHeight = articleHeight - windowHeight;

      if (articleTop > scrollTop) {
        articleSidebarLink.removeClass('read reading');
      } else if (
        scrollTop >= articleTop &&
        articleTop + articleHeight > scrollTop
      ) {
        var dashoffsetValue =
          svgCircleLength * (1 - (scrollTop - articleTop) / articleHeight);
        articleSidebarLink
          .addClass('reading')
          .removeClass('read')
          .find('circle')
          .attr({ 'stroke-dashoffset': dashoffsetValue });
        changeHash(articleSidebarLink.attr('href'));
      } else {
        articleSidebarLink.removeClass('reading').addClass('read');
      }
    });
    scrolling = false;
  }

  function changeHash(link) {
    var currentPage = location.hash;
    if (link != currentPage && history.pushState)
      window.history.pushState({ hash: link }, '', link);
  }

  function checkMQ() {
    return window
      .getComputedStyle(articlesWrapper.get(0), '::before')
      .getPropertyValue('content')
      .replace(/'/g, '')
      .replace(/"/g, '');
  }

  $('.menu-show-button').click(function () {
    $('.cd-read-more-container').show();
  });

  $('.menu-hide-button').click(function () {
    $('.cd-read-more-container').hide();
  });

  function checkMenuState() {
    if ($(window).width() >= '993') {
      $('.cd-read-more-container').show();
    }
    if ($(window).width() < '993') {
      $('.cd-read-more-container').hide();
    }
  }
});
