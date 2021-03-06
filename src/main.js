/* main.js
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

pkg.initGettext();
pkg.initFormat();
pkg.require({
  'Gio': '2.0',
  'Gtk': '4.0',
  'EDataServer': '1.2',
  'Adw': '1'
});

const { Gio, Gtk, Adw } = imports.gi;

const { DavidWindow } = imports.window;

function main(argv) {
    const application = new Adw.Application({
        application_id: 'dev.ryzokuken.david',
        flags: Gio.ApplicationFlags.FLAGS_NONE,
    });

    application.connect('activate', app => {
        let activeWindow = app.activeWindow;

        if (!activeWindow) {
            activeWindow = new DavidWindow(app);
        }

        activeWindow.present();
    });

    return application.run(argv);
}
