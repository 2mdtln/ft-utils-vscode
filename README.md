# ft_header

Drop a 42 header into any file with one shortcut. The extension keeps the classic layout, remembers the original “Created” timestamp, and updates the “Updated” line every time you save.

```bash
# **************************************************************************** #
#                                                                              #
#                                                          :::      ::::::::   #
#   ft_header                                            :+:      :+:    :+:   #
#                                                      +:+ +:+         +:+     #
#   By: mtaheri <mtaheri@student.42istanbul.com.tr>  +#+  +:+       +#+        #
#                                                  +#+#+#+#+#+   +#+           #
#   Created: 2025/11/15 20:39:25 by mtaheri             #+#    #+#             #
#   Updated: 2026/02/04 18:38:54 by ybarut             ###   ########.fr       #
#                                                                              #
# **************************************************************************** #
```
## Install

1. Launch VS Code and open the Extensions view.
2. Search for **ft_header** and click **Install** (or run `ext install 2mdtln.ft-header` from the command palette).
3. Reload VS Code if prompted.

## How to Use

1. Open any supported source file (C, C++, JavaScript, Python, etc.).
2. Press `⌘⌥H` (macOS) or `Ctrl+Alt+H` (Windows/Linux), or run **Insert 42 Header** from the Command Palette.
3. The header is inserted at the top of the file. Re-running the command refreshes only the “Updated” timestamp.
4. Saving a file that already contains the header automatically updates the `Updated` line.
5. Use the status bar toggle labeled **42 Auto Header** to enable automatic insertion whenever you create a new file.

## How to Configure

Open **Settings → Extensions → ft_header** (or search for `ft_header` in the Settings UI) and adjust:

| Setting | Description |
| --- | --- |
| `ft_header.username` | Your 42 login (used for By, Created, Updated lines). |
| `ft_header.email` | Your 42 student email. |

Prefer configuring via `settings.json`? Add:

```json
{
  "ft_header.username": "your_login",
  "ft_header.email": "your_login@student.42.fr"
}
```

## Issues & Contributing

Bug reports and pull requests are welcome! Please open an issue with reproduction steps or a PR describing the change.

## License

MIT © 2025 — feel free to use, modify, and distribute under the terms of the MIT license.
