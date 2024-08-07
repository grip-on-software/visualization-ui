/*
Navigation heading fragment.

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

import * as d3 from 'd3';
import _ from 'lodash';
import mustache from 'mustache';

const defaultConfiguration = {
    container: "nav",
    languages: "",
    language_page: "",
    language_query: "lang",
    base_url: "",
    window: window,
    document: document
};
const html = (data) => {
    return typeof data !== "undefined" ? mustache.escape(data) : '';
};
class Navbar {
    constructor(configuration, locales) {
        this.config = {...defaultConfiguration, ...configuration};
        this.locales = locales;
        this.types = {
            "brand": (item) => `
                <div class="navbar-brand">
                    ${this.build(item.items)}
                </div>`,
            "link": (item) => `
                <a class="navbar-${html(item.class || "item")}"
                    ${typeof item.url !== "undefined" ? `href="${html(this.link(item.url))}"` : ''}
                    title="${html(this.locale(item.title))}">
                    ${this.icon(item.icon)}
                    ${this.build(item.content)}
                </a>`,
            "fullscreen": (item) => `
                <a class="navbar-item navbar-fullscreen"
                    title="${html(this.locale(item.title))}">
                    ${this.icon(item.icon)}
                </a>`,
            "image": (item) => `
                <img src="${html(this.link(item.url))}" alt="${html(this.locale(item.alt))}"
                    width="${html(item.width)}" height="${html(item.height)}"
                    style="${html(item.style)}">`,
            "text": (item) => `${html(this.locale(item.text))}`,
            "burger": (item) => `
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="${html(item.target)}">
                    ${'<span aria-hidden="true"></span>'.repeat(item.lines)}
                </a>`,
            "menu": (item) => `
                <div class="navbar-menu" id="${html(item.id)}">
                    ${this.build(item.items)}
                </div>`,
            "start": (item) => `
                <div class="navbar-start">
                    ${this.build(item.items)}
                </div>`,
            "end": (item) => `
                <div class="navbar-end">
                    ${this.build(item.items)}
                </div>`,
            "dropdown": (item) => `
                <div class="navbar-item has-dropdown is-hoverable ${html(item.class)}">
                    ${this.build([_.assign({"type": "link", "class": "link"}, item.link)])}
                    <div class="navbar-dropdown is-boxed" ${typeof item.id !== "undefined" ? `id="${html(item.id)}"` : ''}>
                        ${this.build(item.items)}
                    </div>
                </div>`,
            "divider": (item) => `<hr class="navbar-divider">`
        };
    }

    locale(data) {
        if (typeof data === "string" || typeof data === "undefined") {
            return data;
        }
        return this.locales.retrieve(data, null, data.en);
    }

    link(data) {
        if (typeof data === "object") {
            if (Array.isArray(data)) {
                const nav = this;
                return _.map(data, (item) => nav.link(item)).join('');
            }
            else if (typeof data.config !== "undefined") {
                return this.config[data.config];
            }
            else if (typeof data.locale !== "undefined") {
                return data.locale === "lang" ? this.locales.lang :
                    this.locales.get(data.locale);
            }
            else {
                return this.locale(data);
            }
        }
        return data;
    }

    icon(data) {
        if (typeof data === "undefined") {
            return '';
        }
        return `<span class="icon">
            <i class="${html(Array.isArray(data) ?
    data.map((part, i) => i === 0 ? part : `fa-${part}`).join(' ') : data
)}" aria-hidden="true"></i>
        </span>`;
    }

    build(structure) {
        if (typeof structure === "object" && !Array.isArray(structure)) {
            return html(this.locale(structure));
        }
        const nav = this;
        return _.map(structure, (item) => {
            return (nav.types[item.type] || ((obj) => {
                console.log(`Invalid type: ${obj.type}\n${obj}`);
                return '';
            }))(item);
        }).join('\n');
    }

    fill(structure) {
        const selection = d3.select(this.config.container);
        selection.html(this.build(structure));

        if (this.config.languages) {
            const languages = selection.select(this.config.languages);
            const canonicalUrl = new URL(this.config.language_page,
                this.config.base_url || this.config.document.location
            );
            canonicalUrl.searchParams.delete(this.config.language_query);
            canonicalUrl.hash = '';
            this.locales.generateNavigation(languages,
                canonicalUrl, this.config.language_query, 'link', 'navbar-item',
                this.config.document.location.hash
            );
            this.config.window.addEventListener("hashchange", () => {
                this.locales.updateNavigationLinks(languages.selectAll('a'),
                    canonicalUrl, this.config.language_query,
                    this.config.document.location.hash,
                    canonicalUrl.search === '' ? '?' : '&'
                );
            });
        }

        this.setNavbarTrigger(selection);
        this.setFullscreenTrigger(selection);
    }

    setNavbarTrigger(selection) {
        selection.selectAll('.navbar-burger').on('click', function() {
            const burger = d3.select(this);
            const targetSelector = burger.attr('data-target');
            const target = d3.select(`#${targetSelector}`);
            const targetActive = target.classed('is-active');

            burger.classed('is-active', !targetActive)
                .attr('aria-expanded', targetActive ? 'false' : 'true');
            target.classed('is-active', !targetActive);
        });
    }

    setFullscreen(isFullscreen) {
        const selection = d3.select(this.config.container);
        selection.selectAll('.navbar-fullscreen')
            .classed('is-active', isFullscreen);
        selection.dispatch('fullscreen', {isFullscreen});
    }

    setFullscreenTrigger(selection) {
        const doc = this.config.document;
        const handler = d3.select(doc);
        selection.selectAll('.navbar-fullscreen').on('click', function() {
            const toggle = d3.select(this);
            const fullscreen = toggle.classed('is-active');
            if (fullscreen) {
                /* istanbul ignore next */
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                }
                else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                }
                else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                }
                else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                }
            }
            else {
                const element = doc.documentElement;
                /* istanbul ignore next */
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                }
                else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                }
                else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                }
                else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        });

        const nav = this;
        /* istanbul ignore next */
        handler.on('fullscreenchange', function() {
            nav.setFullscreen(!!doc.fullscreen);
        });
        /* istanbul ignore next */
        handler.on('mozfullscreenchange', function() {
            nav.setFullscreen(!!doc.mozFullScreen);
        });
        /* istanbul ignore next */
        handler.on('webkitfullscreenchange', function() {
            nav.setFullscreen(!!doc.webkitIsFullScreen);
        });
        /* istanbul ignore next */
        handler.on('msfullscreenchange', function() {
            nav.setFullscreen(!!doc.msFullscreenElement);
        });
    }
}

export default Navbar;
