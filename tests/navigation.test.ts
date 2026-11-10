// Unit tests for the header scroll-spy rule in src/lib/navigation.ts. Run: bun run test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickActiveNav, type SectionPosition } from '../src/lib/navigation.ts';

const LINE = 300;

// Home page order: Hero, About, Services, Portfolio, …, Contact. `scrolled` shifts every section up.
const homePage = (scrolled: number): SectionPosition[] => [
  { view: 'about', top: 900 - scrolled },
  { view: 'services', top: 2000 - scrolled },
  { view: 'portfolio', top: 3200 - scrolled },
  { view: 'contact', top: 9000 - scrolled }
];

test('home page: Home is underlined until the About section reaches the line', () => {
  assert.equal(pickActiveNav(homePage(0), LINE, false, 'home'), 'home');
  assert.equal(pickActiveNav(homePage(599), LINE, false, 'home'), 'home');
  assert.equal(pickActiveNav(homePage(600), LINE, false, 'home'), 'about');
});

test('underline follows the section on screen in both scroll directions', () => {
  assert.equal(pickActiveNav(homePage(1800), LINE, false, 'home'), 'services');
  assert.equal(pickActiveNav(homePage(3000), LINE, false, 'home'), 'portfolio');
  assert.equal(pickActiveNav(homePage(8800), LINE, false, 'home'), 'contact');
  assert.equal(pickActiveNav(homePage(1800), LINE, false, 'home'), 'services');
});

test('sections without a link of their own keep the previous link underlined', () => {
  // Between Portfolio (3200) and Contact (9000) sit Why Choose Us, Process, FAQ and so on.
  assert.equal(pickActiveNav(homePage(6000), LINE, false, 'home'), 'portfolio');
});

test('at the bottom of the page the last section is underlined even if it is short', () => {
  assert.equal(pickActiveNav(homePage(8500), LINE, true, 'home'), 'contact');
});

test('order comes from position, not from the order sections are listed in', () => {
  const shuffled = [...homePage(1800)].reverse();
  assert.equal(pickActiveNav(shuffled, LINE, false, 'home'), 'services');
});

test('other views and legal pages', () => {
  // About view: About sits at the top and Contact at the end.
  const aboutView: SectionPosition[] = [{ view: 'about', top: 120 }, { view: 'contact', top: 5000 }];
  assert.equal(pickActiveNav(aboutView, LINE, false, 'about'), 'about');
  // Privacy / Terms pages have none of these sections, so no link is underlined (as before).
  assert.equal(pickActiveNav([], LINE, false, 'privacy'), 'privacy');
  assert.equal(pickActiveNav([], LINE, true, 'terms'), 'terms');
});
