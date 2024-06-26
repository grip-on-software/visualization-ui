/*
Unit tests for the visualization navigation bar fragment.

Copyright 2017-2020 ICTU
Copyright 2017-2022 Leiden University
Copyright 2017-2024 Leon Helwerda

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* jshint node: true, mocha: true */
'use strict';

const assert = require('chai').assert,
      setupPage = require('./index');

describe('Navigation bar', () => {
    it('Builds navigation', (done) => {
        const specs = require('./locales.json');
        const structure = require('./navbar.json');
        const { window, d3, Locale, Navbar } = setupPage('<div id="navbar"></div>', done);
        const locales = new Locale(specs);
        const config = {
            "container": "#navbar",
            "languages": "#languages",
            "language_page": "index.html?x=y#ignored",
            "language_query": "l",
            "my_url": "http://localhost"
        };
        const nav = new Navbar(config, locales);
        const elm = d3.select('#navbar');
        nav.fill(structure);
        const brand = elm.select('.navbar-brand');
        const logo = brand.select('a.navbar-item');
        assert.equal(logo.attr('href'), 'http://localhost');
        assert.equal(logo.attr('title'), 'Page');
        const img = logo.select('img');
        assert.equal(img.attr('src'), 'logo.svg');
        assert.equal(img.attr('alt'), 'Brand');
        assert.equal(img.attr('width'), '28');
        assert.equal(img.attr('height'), '28');

        const burger = brand.select('.navbar-burger');
        assert.equal(burger.attr('data-target'), 'menu-content');
        assert.equal(burger.selectAll('span').size(), 3);

        const fullscreen = brand.select('.navbar-fullscreen');
        assert.equal(fullscreen.attr('title'), 'Full screen');
        assert.equal(fullscreen.select('.icon i').attr('class'), 'fas fa-arrows-alt');

        const menu = elm.select('.navbar-menu');
        assert.equal(menu.attr('id'), 'menu-content');
        const item = menu.select('.navbar-start .navbar-item');
        assert.isTrue(item.classed('has-dropdown'));
        const link = item.select('.navbar-link');
        assert.equal(link.attr('href'), 'http://localhost/content?prop=value&message=Message content');
        assert.equal(link.text().trim(), 'Contents');
        const items = item.selectAll('.navbar-dropdown a.navbar-item');
        assert.equal(items.size(), 2);
        assert.equal(items.filter(':first-child').attr('href'), 'one');
        assert.equal(items.filter(':first-child').text().trim(), 'One');
        assert.equal(items.filter(':first-child').select('.icon i').attr('class'), 'timeline-icon');

        assert.equal(items.filter(':last-child').attr('href'), 'two');
        assert.equal(items.filter(':last-child').text().trim(), 'Two');
        assert.equal(items.filter(':last-child').select('.icon i').attr('class'), 'far fa-circle');
        const divider = item.select('.navbar-dropdown hr');
        assert.isTrue(divider.classed('navbar-divider'));

        const languages = menu.select('.navbar-end > .navbar-item.has-dropdown');
        const back = languages.select('.navbar-link');
        assert.isNull(back.attr('href'));
        assert.equal(back.attr('title'), 'Return to default language');
        assert.equal(back.select('.icon i').attr('class'), 'fas fa-language fa-xs');
        const langs = languages.selectAll('#languages > ul > li');
        assert.equal(langs.size(), 2);
        const active = langs.select('a.is-active');
        assert.isTrue(active.classed('navbar-item'));
        assert.equal(active.attr('href'), 'https://example.test/index.html?x=y&l=en');
        assert.equal(active.attr('hreflang'), 'en');
        assert.equal(active.text(), 'English');
        const inactive = langs.select('a:not(.is-active)');
        assert.isTrue(active.classed('navbar-item'));
        assert.equal(inactive.attr('href'), 'https://example.test/index.html?x=y&l=nl');
        assert.equal(inactive.attr('hreflang'), 'nl');
        assert.equal(inactive.text(), 'Nederlands');
        const end = menu.select('.navbar-end > a.navbar-item');
        assert.equal(end.attr('href'), 'https://example.com');
        assert.equal(end.attr('title'), 'Example');
        const example = end.select('img');
        assert.equal(example.attr('src'), 'http://localhost/example-en.svg');
        assert.equal(example.attr('width'), '50');
        assert.equal(example.attr('height'), '24');

        window.addEventListener("hashchange", () => {
            assert.isNull(back.attr('href'));
            assert.equal(active.attr('href'), 'https://example.test/index.html?x=y&l=en#abc');
            assert.equal(inactive.attr('href'), 'https://example.test/index.html?x=y&l=nl#abc');
            done();
        });
        window.document.location.hash = "#abc";
    });
    it('Ignores invalid types', (done) => {
        const specs = require('./locales.json');
        const structure = [{"type": "invalid"}];
        const { d3, Locale, Navbar } = setupPage('<div id="navbar"></div>', done);
        const locales = new Locale(specs);
        const config = {
            "container": "#navbar"
        };
        const nav = new Navbar(config, locales);
        const elm = d3.select('#navbar');
        nav.fill(structure);

        assert.equal(elm.html(), '');

        done();
    });
    it('Dispatches burger events', (done) => {
        const specs = require('./locales.json');
        const structure = require('./navbar.json');
        const { d3, Locale, Navbar } = setupPage('<div id="navbar"></div>', done);
        const locales = new Locale(specs);
        const config = {
            "container": "#navbar",
            "languages": "#languages",
        };
        const nav = new Navbar(config, locales);
        const elm = d3.select('#navbar');
        nav.fill(structure);
        const burger = elm.select('.navbar-burger');

        // Click burger twice to test if the menu opens and closes
        var set = false;
        burger.on('click.test', () => {
            set = !set;
            assert.equal(burger.classed('is-active'), set);
            assert.equal(elm.select('#menu-content').classed('is-active'), set);
            if (set) {
                burger.dispatch('click');
            }
            else {
                done();
            }
        });
        burger.dispatch('click');
    });
    it('Dispatches fullscreen events', (done) => {
        const specs = require('./locales.json');
        const structure = require('./navbar.json');
        const { window, d3, Locale, Navbar } = setupPage('<div id="navbar"></div>', done);
        const locales = new Locale(specs);
        const config = {
            "container": "#navbar",
            "languages": "#languages",
        };
        const nav = new Navbar(config, locales);
        const elm = d3.select('#navbar');
        nav.fill(structure);
        window.location.hash = '#content';
        const fullscreen = elm.select('.navbar-fullscreen');

        let count = 0;
        elm.on('fullscreen', () => {
            count++;
            assert.equal(fullscreen.classed('is-active'), count < 2);
            if (count < 2) {
                fullscreen.dispatch('click');
                nav.setFullscreen(false);
            }
            else {
                done();
            }
        });
        fullscreen.dispatch('click');
        nav.setFullscreen(true);
    });
});
