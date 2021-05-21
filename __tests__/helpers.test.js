const {format_date, format_plural, format_url} = require('../utils/helpers');

test('format_date() returns a date string in MM/DD/YYYY format', () => {
    const date = new Date('2020-03-20 16:12:03');

    expect(format_date(date)).toBe('3/20/2020');
});

test('return plural or non plurized words', () => {
    const word = 'tiger';

    expect(format_plural(word, 1)).toBe('tiger');
    expect(format_plural(word, 2)).toBe('tigers');
});

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(format_url(url1)).toBe('test.com');
    expect(format_url(url2)).toBe('coolstuff.com');
    expect(format_url(url3)).toBe('google.com');
})