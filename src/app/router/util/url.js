import * as Qs from 'qs';

export function urlWithQuery(path, query) {
  let qs = (typeof query === 'string')
    ? query
    : Qs.stringify(query, { encode: true, skipNulls: true });
  return path + (qs ? '?' + qs : '');
}
