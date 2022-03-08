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

function sourceActionRow(source) {
  const title = GLib.markup_escape_text(source.get_display_name(), -1);
  const subtitle = GLib.markup_escape_text(`${source.get_uid()} P:${source.get_parent() || "NONE"}`, -1);
  const row = new Adw.ActionRow({ title, subtitle, visible: true });
  const swtch = new Gtk.Switch({ active: source.get_enabled(), valign: Gtk.Align.CENTER });
  row.add_suffix(swtch);
  return row;
}

function sourceArrToList(arr) {
  const store = Gio.ListStore.new(EDataServer.Source);
  arr.forEach(el => store.append(el));
  return store;
}

var DavidWindow = GObject.registerClass({
    GTypeName: 'DavidWindow',
    Template: 'resource:///dev/ryzokuken/david/window.ui',
    InternalChildren: ['list']
}, class DavidWindow extends Adw.ApplicationWindow {
    _init(application) {
        super._init({ application });

        const registry = EDataServer.SourceRegistry.new_sync(null);
        const sources = registry.list_sources(null);
        /*sources.forEach((source) => {
          const isCal = source.has_extension(EDataServer.SOURCE_EXTENSION_CALENDAR);
          const isDAV = source.has_extension(EDataServer.SOURCE_EXTENSION_WEBDAV_BACKEND);
          const isGOA = source.has_extension(EDataServer.SOURCE_EXTENSION_GOA);
          const isCollection = source.has_extension(EDataServer.SOURCE_EXTENSION_COLLECTION);
          if (true) {
            const title = GLib.markup_escape_text(source.get_display_name(), -1);
            const subtitle = GLib.markup_escape_text(`${source.get_uid()} P:${source.get_parent() || "NONE"}`, -1);
            const row = new Adw.ActionRow({ title, subtitle });
            const swtch = new Gtk.Switch({ active: source.get_enabled(), valign: Gtk.Align.CENTER });
            row.add_suffix(swtch);
            this._listBox.insert(row, -1);
          }
        });*/
        const root = sources.filter(source => source.get_parent() === null);
        const tree = Gtk.TreeListModel.new(
          sourceArrToList(root), 
          false, 
          true, 
          item => sourceArrToList(sources.filter(source => source.get_parent() === item.get_uid()))
        );
        const selection = Gtk.SingleSelection.new(tree)
        const factory = new Gtk.SignalListItemFactory();
        factory.connect("setup", (_, item) => {
          const swtch = new Gtk.Switch({ valign: Gtk.Align.CENTER });
          const row = new Adw.ActionRow({ activatable_widget: swtch })
          row.add_suffix(swtch)
          item.set_child(row)
        });
        factory.connect("bind", (_, item) => {
          const li = item.get_item().get_item();
          const row = item.get_child();
          row.set_title(GLib.markup_escape_text(li.get_display_name(), -1));
          row.set_subtitle(GLib.markup_escape_text(li.get_uid(), -1));
          if (li.get_enabled()) {
            row.activate();
          }
        });
        this._list.set_factory(factory);
        this._list.set_model(selection);
    }
});

