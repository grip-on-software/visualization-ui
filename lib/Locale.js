/*
Locale selection.

Copyright 2017-2020 ICTU
Copyright 2017-2022 Leiden University
Copyright 2017-2023 Leon Helwerda

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
import {vsprintf} from 'sprintf-js';

class Locale {
    constructor(specs = {}, lang="en") {
        this.specs = specs;
        this.lang = lang;
        this.selectedLocale = specs[lang];
    }

    // Update the selected locale if a language specification exists for it.
    select(lang) {
        if (lang in this.specs) {
            this.lang = lang;
            this.selectedLocale = this.specs[lang];
        }
        return this.selectedLocale;
    }

    // Retrieve the D3 locale based on the locale attributes.
    locale() {
        return d3.formatLocale(this.selectedLocale);
    }

    // Retrieve a message and replace placehodlers with a list of arguments in
    // the message string. If the message cannot be located, then either the
    // fallback or a description of the message and its arguments is returned.
    message(msg, args, fallback=undefined) {
        if ("messages" in this.selectedLocale && msg in this.selectedLocale.messages) {
            return vsprintf(this.selectedLocale.messages[msg], args);
        }
        if (typeof fallback !== "undefined") {
            return fallback;
        }
        return args?.length ? `${msg}(${args.join(",")})` : msg;
    }

    // Retrieve the value in a locale attribute by its key, or the fallback or
    // key if the attribute or key cannot be located.
    attribute(name, key, fallback=undefined) {
        if (name in this.selectedLocale && key in this.selectedLocale[name]) {
            return this.selectedLocale[name][key];
        }
        return typeof fallback !== "undefined" ? fallback : key;
    }

    // Retrieve the value in an external locale specification, an object of
    // objects or an object of strings where the outer object's keys are
    // language codes, by its key or the value itself. If the locale or key
    // cannot be located, then the fallback or key is returned.
    retrieve(specs, key=null, fallback=undefined) {
        let result = specs[this.lang];
        if (typeof result !== "undefined" && key !== null) {
            result = specs[this.lang][key];
        }
        if (typeof result !== "undefined") {
            return result;
        }
        return typeof fallback !== "undefined" ? fallback : key;
    }

    // Retrieve an attribute value.
    get(name) {
        return this.selectedLocale[name];
    }

    // Create a navigation element. The page is the base URL to link to and the
    // query is the query string to append the language to. The query string
    // may have other parameters as long as the final part is the query string
    // key (which may be empty) without the key-value separator, but it is also
    // possible to provide the parameters in the page. Anchor portions should be
    // provided in the hash, starting with a hash sign.
    generateNavigation(nav, page='', query='', linkActive='item', classes='', hash='') {
        if (!(nav instanceof d3.selection)) {
            nav = d3.select(nav);
        }
        let url = null;
        let separator = null;
        try {
            url = new URL(page);
            url.searchParams.delete(query);
            url.hash = '';
            page = url.toString();
            separator = url.search === '' ? '?' : '&';
        }
        catch (error) {
            separator = page.includes('?') ? '&' : '?';
        }

        const updateItems = nav.selectAll('ul')
            .data(['visualization-ui-locale-nav'])
            .join('ul')
            .selectAll('li')
            .data(Object.keys(this.specs));
        const newItems = updateItems.enter()
            .append('li');
        newItems.append('a');
        const items = updateItems.merge(newItems);
        const links = items.selectAll('a')
            .call(this.updateNavigationLinks, page, query, hash, separator)
            .attr('hreflang', d => d)
            .text(d => this.specs[d].language);
        const active = linkActive === 'link' ? links : items;
        active.classed('is-active', d => this.specs[d] == this.selectedLocale)
            .classed(classes, true);

        // Update HEAD with canonical/alternate URLs
        if (url !== null) {
            const head = d3.select('head');
            head.selectAll('link[rel=canonical]')
                .data(['visualization-ui-locale-canonical'])
                .join('link')
                .attr('rel', 'canonical')
                .attr('href', url);
            head.selectAll('link[rel=alternate][hreflang]')
                .data(Object.keys(this.specs))
                .join('link')
                .attr('rel', 'alternate')
                .attr('hreflang', d => d)
                .call(this.updateNavigationLinks, url, query, '', separator);
        }
    }

    updateNavigationLinks(links, page='', query='', hash='', separator='?') {
        links.attr('href',
            d => `${page}${separator}${query}${query ? '=' : ''}${d}${hash}`
        );
    }

    // Replace all elements within the selection or the entire document with
    // a data-message attribute with their respective message, using children
    // elements as arguments to the message. Set fallback to null to keep the
    // contents or attributes if the message is not found.
    updateMessages(selection=undefined, attributes=[], fallback=undefined) {
        const locale = this;
        if (typeof selection === "undefined") {
            selection = d3.selection().attr("lang", this.lang);
        }
        selection.selectAll("[data-message]").each(function() {
            if (!selection.node().contains(this)) {
                return;
            }
            const msg = this.getAttribute("data-message");
            const children = Array.from(this.children).map((c) => c.outerHTML);
            const replacement = locale.message(msg, children, fallback);
            if (replacement !== null) {
                locale.updateMessages(d3.select(this).html(replacement), attributes);
            }
        });
        attributes.forEach((attribute) => {
            selection.selectAll(`[data-message-${attribute}]`).each(function() {
                const msg = this.getAttribute(`data-message-${attribute}`);
                const replacement = locale.message(msg, null, fallback);
                if (replacement !== null) {
                    d3.select(this).attr(attribute, replacement);
                }
            });
        });
    }
}

export default Locale;
