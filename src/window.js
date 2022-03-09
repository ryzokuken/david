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

const { GObject, Gtk, EDataServer, Adw, GLib, Gio } = imports.gi;

var DavidWindow = GObject.registerClass({
    GTypeName: 'DavidWindow',
    Template: 'resource:///dev/ryzokuken/david/window.ui',
    InternalChildren: ['list']
}, class DavidWindow extends Adw.ApplicationWindow {
    _init(application) {
        super._init({ application });

        const registry = EDataServer.SourceRegistry.new_sync(null);
        const sources = registry.list_sources(EDataServer.SOURCE_EXTENSION_CALENDAR);

        sources.forEach(source => {
          const title = GLib.markup_escape_text(source.get_display_name(), -1);
          const parent = registry.ref_source(source.get_parent());
          const subtitle = GLib.markup_escape_text(parent.get_display_name(), -1);
          const row = new Adw.ActionRow({ title, subtitle });
          const swtch = new Gtk.Switch({ active: source.get_enabled(), valign: Gtk.Align.CENTER });
          row.add_suffix(swtch);
          this._list.insert(row, -1);
        });
    }
});

