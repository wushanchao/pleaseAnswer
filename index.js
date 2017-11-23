var pleaseAnswer = function (textArray, callbackObj, unmatchCallback) {
  var textSimilarity = function (str1, str2) {

    // 编辑距离算法; 后期用于判断字符串相似度
    function levenshtein(str1, str2, options) {
      var collator;
      try {
        collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
      } catch (err) {
        console.log("Collator could not be initialized and wouldn't be used");
      }
      // arrays to re-use
      var prevRow = [], str2Char = [];

      function get(str1, str2, options) {
        var useCollator = (options && collator && options.useCollator);

        var str1Len = str1.length,
          str2Len = str2.length;

        // base cases
        if (str1Len === 0) return str2Len;
        if (str2Len === 0) return str1Len;

        // two rows
        var curCol, nextCol, i, j, tmp;

        // initialise previous row
        for (i = 0; i < str2Len; ++i) {
          prevRow[i] = i;
          str2Char[i] = str2.charCodeAt(i);
        }
        prevRow[str2Len] = str2Len;

        var strCmp;
        if (useCollator) {
          // calculate current row distance from previous row using collator
          for (i = 0; i < str1Len; ++i) {
            nextCol = i + 1;

            for (j = 0; j < str2Len; ++j) {
              curCol = nextCol;

              // substution
              strCmp = 0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

              nextCol = prevRow[j] + (strCmp ? 0 : 1);

              // insertion
              tmp = curCol + 1;
              if (nextCol > tmp) {
                nextCol = tmp;
              }
              // deletion
              tmp = prevRow[j + 1] + 1;
              if (nextCol > tmp) {
                nextCol = tmp;
              }

              // copy current col value into previous (in preparation for next iteration)
              prevRow[j] = curCol;
            }

            // copy last col value into previous (in preparation for next iteration)
            prevRow[j] = nextCol;
          }
        }
        else {
          // calculate current row distance from previous row without collator
          for (i = 0; i < str1Len; ++i) {
            nextCol = i + 1;

            for (j = 0; j < str2Len; ++j) {
              curCol = nextCol;

              // substution
              strCmp = str1.charCodeAt(i) === str2Char[j];

              nextCol = prevRow[j] + (strCmp ? 0 : 1);

              // insertion
              tmp = curCol + 1;
              if (nextCol > tmp) {
                nextCol = tmp;
              }
              // deletion
              tmp = prevRow[j + 1] + 1;
              if (nextCol > tmp) {
                nextCol = tmp;
              }

              // copy current col value into previous (in preparation for next iteration)
              prevRow[j] = curCol;
            }

            // copy last col value into previous (in preparation for next iteration)
            prevRow[j] = nextCol;
          }
        }
        return nextCol;
      };

      return get(str1, str2, options);
    }
    return levenshtein(str1, str2);
    // 文字占有比例
    // 通过编辑距离算法和文字占有比例来匹配
  };

  var recognitionCallback = callbackObj || {};
  ['error', 'end', 'resulting', 'unmatch', 'start'].forEach(function (item) {
    if (!recognitionCallback[item]) {
      recognitionCallback[item] = function () { };
    }
  });

  var getRecognition = function () {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = function () {
      recognitionCallback.start();
    };
    recognition.onerror = function (event) {
      console.error('语音引擎无法启动,注意网络环境');
      recognitionCallback.error(event);
    };
    recognition.onend = function () {
      recognitionCallback.end();
    };
    recognition.onresult = function (event) {
      var result = event.results[event.results.length - 1];
      var transcript = result[result.length - 1].transcript;
      recognitionCallback.resulting(transcript);
      if (result.isFinal) {
        var unmatch = true;
        textArray.forEach(function (item, index, array) {
          var text = item.text;
          if (Object.prototype.toString.call(text) === '[object String]') {
            text = [];
            text.push(item.text);
          }

          if (text.includes(transcript)) {
            unmatch = false;
            item.function(text);
            return false;
          }
        });

        if (unmatch) {
          recognitionCallback.unmatch(transcript);
        }
      }
    };
    recognition.lang = 'cmn-Hans-CN';
    return recognition;
  };
  var obj = {};
  var speechInstance = getRecognition();
  obj.start = function () {
    speechInstance.start();
  };
  obj.stop = function () {
    speechInstance.stop();
  }
  return obj;
};

module.exports = pleaseAnswer;