# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 
and we adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Test on Node.js 20 and 22, no longer on 16 and 18.

## [0.8.2] - 2023-09-07

### Changed

- Navbar: Proper canonical URL for updates without language query, hash 
  fragment and correct ampersand or questio mark for additional query 
  parameter.

## [0.8.1] - 2023-09-07

### Changed

- Locale: Remove language parameter from provided absolute page URL with query 
  string and ignore hashes (those are still provided in a separate parameter).
- Locale: When the language navigation is generated in the same container, 
  update the existing items. Note that classes are only added or updated on the 
  links or items depending on the current `linkActive` parameter.

### Fixed

- Locale: Correct query string separator for language parameter if the URL/page 
  has a query string.

## [0.8.0] - 2024-09-05

### Added

- Canonical and alternate `<link>` elements added to the `<head>` based on 
  languages and page URL.

## [0.7.0] - 2023-08-25

### Added

- Navbar: Link items can now have no URL to not generate a `href` attribute.

### Changed

- Navbar: Burger item uses new HTML structure with WCAF/ARIA attribute and 
  toggles classes/ARIA expanded state based on target instead of own state.

### Removed

- Navbar: Remove `is-focus` class functionality for toggling dropdown 
  activeness and prevent clicking on links in dropdown menu headers.

### Security

- Navbar: Escape icon classes.

## [0.6.0] - 2023-06-13

### Changed

- Test on Node 16 and 18 using GitHub Actions, no longer 10 and 12 on Travis.
- Dependencies updated.

### Security

- Navbar: Escape `class` attributes for link and dropdown types.

## [0.5.7] - 2019-12-09

### Changed

- Dependencies updated.

## [0.5.6] - 2019-06-20

### Changed

- Test on Node 10 and 12, no longer 8 and 9.
- Dependencies updated.

### Fixed

- Spinner: Replace `style` attribute with `style` method to avoid ignored 
  attributes in CSP contexts.

## [0.5.5] - 2019-05-06

### Added

- Spinner: `"gros-spinner"` class added to the SVG element and `"outer"` and 
  `"inner"` classes to the paths. The default style is moved to the stylesheet 
  so that it can be overridden.

### Changed

- Dependencies updated.

## [0.5.4] - 2019-03-26

### Added

- Spinner: `update` method added to update the configuration after creation but 
  before a next call to `start`.

## [0.5.3] - 2019-03-22

### Added

- Locale: `lang` attribute of main element updated if no specific element was 
  selected.
- Locale: Navbar languages menu is updated with anchor.

## [0.5.2] - 2019-03-04

### Fixed

- Navigation: Decode anchor to determine what to select.

## [0.5.1] - 2019-01-14

### Changed

- Navbar: When clicking a link of a dropdown item with `is-focus` class, then 
  do not follow the link and instead keep the dropdown displayed.

## [0.5.0] - 2018-12-13

### Changed

- Renamed all classes to use CamelCase naming.
- Spinner: Use CSS animation with keyframes instead of timeout-based interval 
  for better animation during load.
- Dependencies updated.

## [0.4.8] - 2018-10-17

### Added

- Navbar: The `icon` attribute (e.g. for link items) can now be a string or an 
  array of any length instead of exactly length two. Array elements after the 
  first index are automatically prefixed with `fa-`, string attributes are not.

## [0.4.7] - 2018-09-24

### Changed

- Dependencies updated.

### Fixed

- Navigation: `updateElement` callback now consistently receives the parent 
  list item selection (like `removeElement`) instead of sometimes the parent 
  selection and sometimes the links themselves.

## [0.4.6] - 2018-06-25

### Fixed

- Spinner: Rotation duration is now applied from configuration instead of an 
  unused parameter, so that it properly spins.

## [0.4.5] - 2017-06-21

### Fixed

- Navigation: Update active selection with `isActive` callback with the correct 
  parameters for key and data (like when setting the current item).

## [0.4.4] - 2018-06-21

### Added

- Navigation: `key` function callback for ordering or translating data in items 
  to a value for link generation and hash comparisons.

## [0.4.3] - 2018-06-20

### Added

- Navigation: Update items, remove items or determine if they are active using 
  `updateElement`, `removeElement` and `isActive` callbacks, respectively.
- Spinner: Configurable speed/duration.

### Changed

- Locale: `updateMessages` falls back to current contents/attributes if the 
  message is not found and `fallback` parameter is explicitly set to `null`.
- Tests on Node 8 and 9, no longer 6 and 7.

## [0.4.2] - 2018-03-28

### Added

- Navbar: URLs for links are now able to be generated from an array of sources 
  (objects referring to configuration, locale properties or their own messages) 
  and strings.
- Navbar: Images are now able to be generated from array of sources and strings 
  or sources themselves.

## [0.4.1] - 2018-03-28

### Added

- Navbar: Fullscreen item added to toggle full screen mode.
- Navbar: Small screens can now show the menu by pressing the burger.

## [0.4.0] - 2018-03-22

### Added

- Locale: `linkActive` parameter added to `generateNavigation` which causes the 
  link to get the `is-active` class rather than the list item.
- Navbar: Support adding languages to a menu via selector and additional 
  parameters for page/query target in configuration.

### Changed

- Navbar: The container selection is now obtained from configuration instead of 
  a parameter to the `fill` method.

## [0.3.0] - 2018-03-22

### Added

- Navbar: Configurable navigation bar construction added.

## [0.2.4] - 2018-03-07

### Added

- Locale: `fallback` argument added to `message`, `attribute` and `retrieve` 
  methods for handling missing entries.

## [0.2.3] - 2018-02-26

### Added

- Locale: `attributes` parameter added to `updateMessages` to select specific 
  data attributes (`data-message-...`) to replace with attributes based on 
  their unprefixed variant and values from messages.

### Fixed

- Locale: Detect removed nodes and perform nested calls to work with nodes that 
  were replaced with messages.

## [0.2.2] - 2018-02-21

### Added

- Locale: `message`, `attribute` and `retrieve` methods now return parts or all 
  of their parameters if an entry cannot be located, as fallback.

## [0.2.1] - 2018-02-21

### Added

- Locale: `lang` property added which holds the current language code.
- Locale: `retrieve` method added for obtaining text from an external 
  specification parameter.

## [0.2.0] - 2018-02-19

### Added

- Locale class for localization support.

## [0.1.0] - 2017-12-21

### Added

- Navigation: `prefix` configuration added to set a prefix for the instance, 
  with anchors that do not start with the prefix ignored.
- Navigation: `addElement` callback added to allow customization of a newly 
  created item.
- Test on Travis with Node 6, 7 and 8.

### Changed

- Navigation: `setCurrentItem` callback replaces `setCurrentProject`. It can 
  now return a value to determine if the first determine if the first item 
  should be selected if the provided key is not in the list (which is only done 
  if the list has items).

### Fixed

- Spinner: At most one loading spinner per instance is now created.

## [0.0.6] - 2017-12-20

### Fixed

- Navigation: Update the `is-active` class.

## [0.0.5] - 2017-12-20

### Fixed

- Navigation: Update the `is-active` class.

## [0.0.4] - 2017-12-20

### Fixed

- Navigation: Update the `is-active` class.

## [0.0.3] - 2017-12-18

### Changed

- Package now selects the proper files and directories.

## [0.0.2] - 2017-12-18

### Added

- Initial version of common visualization fragments.

[Unreleased]: 
https://github.com/grip-on-software/visualization-ui/compare/v0.8.2...HEAD
[0.8.2]: 
https://github.com/grip-on-software/visualization-ui/compare/v0.8.1...v0.8.2
[0.8.1]: 
https://github.com/grip-on-software/visualization-ui/compare/v0.8.0...v0.8.1
[0.8.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.7.0...0.8.0
[0.7.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.6.0...0.7.0
[0.6.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.7...0.6.0
[0.5.7]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.6...0.5.7
[0.5.6]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.5...0.5.6
[0.5.5]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.4...0.5.5
[0.5.4]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.3...0.5.4
[0.5.3]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.2...0.5.3
[0.5.2]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.1...0.5.2
[0.5.1]:
https://github.com/grip-on-software/visualization-ui/compare/v0.5.0...0.5.1
[0.5.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.8...0.5.0
[0.4.8]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.7...0.4.8
[0.4.7]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.6...0.4.7
[0.4.6]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.5...0.4.6
[0.4.5]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.4...0.4.5
[0.4.4]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.3...0.4.4
[0.4.3]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.2...0.4.3
[0.4.2]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.1...0.4.2
[0.4.1]:
https://github.com/grip-on-software/visualization-ui/compare/v0.4.0...0.4.1
[0.4.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.3.0...0.4.0
[0.3.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.2.4...0.3.0
[0.2.4]:
https://github.com/grip-on-software/visualization-ui/compare/v0.2.3...0.2.4
[0.2.3]:
https://github.com/grip-on-software/visualization-ui/compare/v0.2.2...0.2.3
[0.2.2]:
https://github.com/grip-on-software/visualization-ui/compare/v0.2.1...0.2.2
[0.2.1]:
https://github.com/grip-on-software/visualization-ui/compare/v0.2.0...0.2.1
[0.2.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.1.0...0.2.0
[0.1.0]:
https://github.com/grip-on-software/visualization-ui/compare/v0.0.6...0.1.0
[0.0.6]:
https://github.com/grip-on-software/visualization-ui/compare/v0.0.5...0.0.6
[0.0.5]:
https://github.com/grip-on-software/visualization-ui/compare/v0.0.4...0.0.5
[0.0.4]:
https://github.com/grip-on-software/visualization-ui/compare/v0.0.3...0.0.4
[0.0.3]:
https://github.com/grip-on-software/visualization-ui/compare/v0.0.2...0.0.3
[0.0.2]: https://github.com/grip-on-software/visualization-ui/tag/v0.0.2
