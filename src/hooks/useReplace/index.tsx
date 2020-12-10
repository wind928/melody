import React, { useMemo } from 'react';

type SympleValue = string | number | boolean;

type ReplacerResult = SympleValue | React.ReactElement;

type Replacer = ReplacerResult | ((key?: string) => ReplacerResult);

/**
 * 替换文本的配置
 * key为替换符
 * value 对应替换逻辑，可以是直接的结果，也可以是一个处理函数
 */
interface IReplacerOptions {
  [key: string]: Replacer;
}

// 获取匹配正则对象
const getMatchRegExp = () => /\$\{[\w-]+\}/g;

// 处理通常字符串的 replacer
const COMMON_STRING_PRELACER_KEY = '__common';
const defaultCommonStringReplacer = (v: any) => v;

// 替换文本
function replaceText(key: string, replacer: Replacer) {
  if (typeof replacer === 'function') {
    return replacer(key);
  }

  return replacer;
}

export default (text: string, replaceOptions: IReplacerOptions) => {
  return useMemo(() => {
    // 没有替换逻辑，或者替换的不是字符串，直接返回
    if (!replaceOptions || typeof text !== 'string') {
      return text;
    }

    // 正则替换字符串中的 ${} 占位符
    const regExp = getMatchRegExp();
    let matched;
    let cursor = 0;

    const result: any = [];

    const commonReplacer =
      replaceOptions?.[COMMON_STRING_PRELACER_KEY] ||
      defaultCommonStringReplacer;

    while ((matched = regExp.exec(text)) !== null) {
      const { 0: matchedStr, index } = matched;
      // 距离上一次匹配间隔的字符串
      const intervalStr = text.slice(cursor, index);

      // 处理通常字符
      if (intervalStr) {
        result.push(replaceText(intervalStr, commonReplacer));
      }

      // 处理匹配的字符
      // 去掉首尾的 ${}
      const key = matchedStr.slice(2, matchedStr.length - 1);
      const replacer = replaceOptions[key];
      result.push(
        replacer === undefined ? matchedStr : replaceText(key, replacer),
      );

      // 更新指针位置
      cursor = index + matchedStr.length;
    }

    // 末尾字符串处理
    const endStr = text.slice(cursor);
    if (endStr) {
      result.push(replaceText(endStr, commonReplacer));
    }

    return <>{result}</>;
  }, [replaceText, replaceOptions]);
};
