var simplPRInterval;
chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
  run();
});

function run() {
  simplPRInterval = window.requestAnimationFrame(run);
  PRampage();
}
function PRampage() {
  var arrReviewer = [];
  var arrReviewerApproved = [];
  var $mergeButton = $('.btn.js-merge-branch-action');
  var isOpen = $('.state.state-open').length === 1;
  var isCIRunning = isOpen && $mergeButton.length === 0;
  var hasForceReview = $('.pr-rampage').length > 0;
  var hasEverybodyReviewed = function() { return arrReviewer.length === arrReviewerApproved.length; };
  var allowToMerge = function() {
    $mergeButton.prop('disabled', false);
    $mergeButton.get(0).lastChild.textContent = '\n\rMerge pull request';
  };
  var $forceReview = $('<a style="cursor:pointer;display:block !important;" class="alt-merge-options pr-rampage">Merge without peer review?</a>');
  var $commenter = $('#new_comment_field');

  if (isCIRunning) {
    hasForceReview && $('.pr-rampage').remove();
    return;
  }

  if (isOpen) {
    arrReviewer = $.unique($('div[id^="issue-"]')[0].textContent.replace(/[\n\r]|\s+/g, ' ').match(/(@[\w-]+)/g) || []);
    arrReviewer.forEach(function(reviewer, i) {
      var $hasCommented = $('div[id^="issuecomment-"] div.timeline-comment-header-text > strong > a:contains("' + reviewer.substr(1) + '")');
      if ($hasCommented.length === 1 && $hasCommented.parent().parent().parent().next().find('.comment-body:contains("LGTM")').length >= 1) {
        arrReviewerApproved.push(true);
      }
    });

    if (arrReviewer.length > 0 && hasEverybodyReviewed()) {
      allowToMerge();
    } else {
      $mergeButton.prop('disabled', true);
      $mergeButton.get(0).lastChild.textContent = arrReviewer.length > 0 ? '\n\rMerge approval pending' : '\n\rNo reviewer mentioned';
    }

    if (!hasForceReview) {
      $mergeButton.parent().append($forceReview);
      $('.pr-rampage').on('click', function() {
        allowToMerge();
        window.cancelAnimationFrame(simplPRInterval);
        this.style.display = 'none';
      });
    }

    $commenter.attr('placeholder', 'Leave a comment or Type `LGTM` if Okay');
  } else {
    window.cancelAnimationFrame(simplPRInterval);
  }
}