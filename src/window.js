/* window.js
 *
 * Copyright 2022 Ujjwal Sharma
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { GObject, Gtk, EDataServer } = imports.gi;

var DavidWindow = GObject.registerClass({
    GTypeName: 'DavidWindow',
    Template: 'resource:///dev/ryzokuken/david/window.ui',
    InternalChildren: ['tree']
}, class DavidWindow extends Adw.ApplicationWindow {
    _init(application) {
        super._init({ application });

        const registry = EDataServer.SourceRegistry.new_sync(null);
        const sources = registry.list_sources(null);
        sources.forEach((source) => {
          const label = new Gtk.Label({ label: source.get_display_name(), visible: true });
          this._listBox.insert(label, -1);
        });
    }
});

