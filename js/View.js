// Objekt widoku
(function(G) {
    G.View = {
        
        /*
         *      Generowanie stron gry
         */
        
        // Generuje stronę główną
        generateStartPage: function() {
            var page            = $("<div/>").attr("id", "game_start_page").addClass("page"),
                central         = $("<div/>").attr("id", "game_start_page_central"),
                name            = $("<div/>").attr("id", "game_start_page_name").text(G.Info.name),
                start_button    = $("<a/>").attr({
                                            id      : "game_start_page_start_button",
                                            href    : "#"
                                           }).text("Start"),
                config_button   = $("<a/>").attr({
                                            id      : "game_start_page_config_button",
                                            href    : "#"
                                           }),
                version         = $("<div/>").attr("id", "game_version").text("Version " + G.Info.version);
            
            central.append(name).append(start_button);
            page.append(central).append(config_button).append(version);
            
            // Dodaje do struktury
            G.Config.game_container.append(page);
            
            // Zapamiętuje wskazanie na stronę startową
            G.Config.game_start_page = page;
        },
        
        // Generuje stronę konfiguracyjną
        generateConfigPage: function() {
            var config_page             = $("<div/>").attr("id", "game_config_page").addClass("page"),
                header                  = $("<div/>").attr("id", "game_config_page_header").text("Ustawienia gry"),
                section_header          = $("<div/>").addClass("game_config_page_section_header"),
                players                 = $("<div/>").attr("id", "game_config_page_players").addClass("game_config_page_section"),
                player                  = $("<div/>").addClass("game_config_page_player"),
                player_button           = $("<a/>").attr("href", "#").addClass("game_config_page_player_button"),
                player_name             = $("<div/>").addClass("game_config_page_player_name"),
                player_color            = $("<div/>").addClass("game_config_page_player_color"),
                new_player              = $("<div/>").attr("id", "game_config_page_new_player").addClass("game_config_page_player").text("+"),
                dimentions              = $("<div/>").attr("id", "game_config_page_dimentions").addClass("game_config_page_section"),
                amount                  = $("<input/>").attr("type", "number").addClass("game_config_page_amount"),
                others                  = $("<div/>").attr("id", "game_config_page_others").addClass("game_config_page_section"),
                option_name             = $("<div/>").addClass("game_config_page_option_name"),
                back_button             = $("<a/>").attr({
                                                    id      : "game_config_page_back_button",
                                                    href    : "#"
                                                   });
                                                   
            // Dodaje do struktury nagłowek strony
            config_page.append(header);
            
            // Tworzy sekcję graczy
            // Dodaje nagłowek do sekcji
            players.append(section_header.clone().text("Gracze"));
            
            // Dodaje graczy
            $.each(G.Config.players_names, function(id, name) {
                players.append(player.clone().attr("data-id", id)
                                     .append(player_button.clone().attr("data-id", id).addClass("game_config_page_player_edit_button"))
                                     .append(player_button.clone().attr("data-id", id).addClass("game_config_page_player_delete_button"))
                                     .append(player_name.clone().attr("data-id", id).text(name))
                                     .append(player_color.clone().attr("data-id", id).css("background-color", G.Config.players_colors[id])));
            });
            
            // Dodaje pole do dodawania graczy
            players.append(new_player);
            
            // Dodaje sekcję do strony
            config_page.append(players);
            
            
            // Tworzy sekcję wymiarów
            // Dodaje nagłowek do sekcji
            dimentions.append(section_header.clone().text("Wymiary mapy"));
            
            // Dodaje pola wymiarów
            dimentions.append(option_name.clone().text("Wiersze"))
                      .append(amount.clone().addClass("game_config_page_amount").attr("min", 7).attr("data-option", "game_rows").attr("value", G.Config.game_rows))
                      .append(option_name.clone().text("Kolumny"))
                      .append(amount.clone().addClass("game_config_page_amount").attr("min", 7).attr("data-option", "game_columns").attr("value", G.Config.game_columns));
            
            // Dodaje sekcję do strony
            config_page.append(dimentions);
            
            // Tworzy sekcję pozostałych opcji
            // Dodaje nagłowek do sekcji
            others.append(section_header.clone().text("Inne"));
            
            // Dodaje ilość pól potrzebnych do zwycięstwa
            others.append(option_name.clone().text("Ilość pól potrzebnych do zwycięstwa"))
                  .append(amount.clone().attr("value", G.Config.win_at).attr("min", 3).attr("data-option", "win_at").addClass("game_config_page_amount"));
            
            // Dodaje sekcję do struktury
            config_page.append(others);
            
            
            // Dodaje do stroktury guzik powrotu
            config_page.append(back_button);
            
            
            // Dodaje do struktury
            G.Config.game_container.append(config_page);
            
            // Zapamiętuje wskazanie na stronę konfiguracyjną
            G.Config.game_config_page = config_page;
        },
        
        // Generuje stronę gry(ale nie planszę)
        generateGamePage: function() {
            var game_page = $("<div/>").attr("id", "game_page").addClass("page");
            
            // Dodaje do struktury
            G.Config.game_container.append(game_page);
            
            // Zapamiętuje wskazanie na stronę gry
            G.Config.game_page = game_page;
        },
        
        // Generuje stronę końcową
        generateEndPage: function() {
            var end_page        = $("<div/>").attr("id", "game_end_page").addClass("page"),
                central         = $("<div/>").attr("id", "game_end_page_central"),
                result          = $("<div/>").attr("id", "game_end_page_result"),
                again_button    = $("<button/>").attr("id", "game_end_page_again_button").text("Zagraj jeszcze raz"),
                exit_button     = $("<a/>").attr({
                    id: "game_end_page_exit_button",
                    href: "#"
                });
            
            // Dodaje do struktury
            central.append(result).append(again_button);
            end_page.append(central).append(exit_button);
            G.Config.game_container.append(end_page);
            
            // Zapamiętuje wskazanie na stronę końcową
            G.Config.game_end_page = end_page;
        },
        
        
        
        /*
         *      Zarządzanie widokami stron gry
         */
        
        // Pokazuje stronę główną
        showStartPage: function() {
            G.Config.game_start_page.show();
        },
        
        // Chowa stronę główną
        hideStartPage: function() {
            G.Config.game_start_page.hide();
        },
        
        // Pokazuje stronę konfiguracyjną
        showConfigPage: function() {
            G.Config.game_config_page.show();
        },
        
        // Ukrywa stronę konfiguracyjną
        hideConfigPage: function() {
            G.Config.game_config_page.hide();
        },
        
        // Pokazuje stronę gry
        showGamePage: function() {
            G.Config.game_page.show();
        },
        
        // Ukrywa stronę gry
        hideGamePage: function() {
            G.Config.game_page.hide();
        },
        
        // Pokazuje stronę końcową
        showEndPage: function() {
            G.Config.game_end_page.show();
        },
        
        // Ukrywa stronę końca gry
        hideEndPage: function() {
            G.Config.game_end_page.hide();
        },
        
        
        
        /*
         *      Wizualizacja gry   
         */
        
        // Generuje strukturę gry
        generateGameStructure: function() {
            // Czyści stronę gry
            G.Config.game_page.html("");
            
            // Tworzy panel wyników
            G.View.generateGamePanel();
            
            // Tworzy planszę gry
            G.View.generateGameBoard();
            
            // Tworzy elementy kontrolne
            G.View.generateControl();
        },
        
        // Tworzy panel wyników
        generateGamePanel: function() {
            var panel = $("<div/>").attr("id", "game_panel"),
                player,
                player_name;
        
            $.each(G.Config.players_names, function(id, name) {
                player = $("<div/>").addClass("game_panel_player").attr("data-id", id).text(name).css({
                    width: (100/G.Config.players) + "%",
                    color: G.Config.players_colors[id]
                });
                
                player.append(player_name);
                panel.append(player);
            });
            
            // Dodaje do struktury
            G.Config.game_page.append(panel);
        },
        
        // Tworzy planszę gry
        generateGameBoard: function() {
            var box         = $("<div/>").attr("id", "game_box"),
                box_wrap    = $("<div/>").attr("id", "game_box_wrap"),
                column,
                field;
        
            for (var i = 0; i < G.Config.game_columns; i++) {
                column = $("<div/>").addClass("game_column").attr("data-n", i);
                
                for (var j = 0; j < G.Config.game_rows; j++) {
                    field = $("<div/>").addClass("game_field").attr({
                        "data-column": i,
                        "data-row": j
                    });
                    
                    column.append(field);
                }
                
                box_wrap.append(column);
            }
            
            // Dodaje do struktury
            box.append(box_wrap);
            G.Config.game_page.append(box);
        },
        
        // Dostosowuje wielkość pól gry
        adjustFieldsSize: function() {
            var game_box        = G.Config.game_page.find("#game_box"),
                fields          = G.Config.game_page.find(".game_field"),
                size_rows       = Math.floor((game_box.height() - (G.Config.game_rows+1)*parseInt(fields.css("margin-bottom")))/G.Config.game_rows),
                size_columns    = Math.floor((game_box.width() - (2*G.Config.game_columns)*parseInt(fields.css("margin-right")))/G.Config.game_columns),
                size;
            
            size = Math.min(size_rows, size_columns);
            
            fields.css({
                width   : size,
                height  : size
            });
        },
        
        // Generuje elementy kontrolne
        generateControl: function() {
            var exit_button = $("<a/>").attr({
                id: "game_page_exit_button",
                href: "#"
            });
            
            G.Config.game_page.append(exit_button);
        },
        
        // Animuje ruch
        move: function() {
            var player      = G.Config.player,
                last_move   = G.Config.last_move,
                color       = G.Config.players_colors[player],
                field       = G.Config.game_page.find("[data-row=" + last_move.row + "][data-column=" + last_move.column + "]");
            
            // Zaznacza pole
            field.css("background-color", color);
        },
        
        // Pokazuje do kogo należy ruch
        showWhoseMove: function() {
            G.Config.game_page.find(".game_panel_player_active").removeClass("game_panel_player_active");
            G.Config.game_page.find(".game_panel_player[data-id=" + G.Config.player + "]").addClass("game_panel_player_active");
        },
        
        // Pokazuje zwycięski łańcuch
        showWinChain: function() {
            $.each(G.Config.win_chain, function(i, position) {
                G.Config.game_page.find("[data-row=" + position.row + "][data-column=" + position.column + "]").addClass("game_field_win");
            });
        },
        
        // Wypełnia stronę końcową
        fillEndPage: function(winner) {
            var result = G.Config.game_end_page.find("#game_end_page_result");
            
            if (winner) {
                result.html("Zwyciężył/a " + G.Config.players_names[G.Config.player]);
            }
            else {
                result.html("Remis");
            }
        },
        
        
        
        /*
         *      Konfiguracja gry
         */
        
        // Umożliwia edycję gracza
        startEditPlayerName: function(id) {
            var player = G.Config.game_config_page.find(".game_config_page_player_name[data-id='" + id + "']"),
                input = $("<input/>").attr("type", "text").attr("data-id", id).addClass("game_config_page_edit_player_input");
                
            input.val(player.text());
            player.html(input);
        },
        
        // Kończy edycję gracza
        endEditPlayerName: function(id) {
            var player = G.Config.game_config_page.find(".game_config_page_player_name[data-id='" + id + "']");
            
            player.text(player.find("input").val());
        },
        
        // Zmienia kolor gracza
        editPlayerColor: function(id) {
            G.Config.game_config_page.find(".game_config_page_player_color[data-id='" + id + "']").css("background-color", G.Config.players_colors[id]);
        },
        
        // Usuwa gracza
        deletePlayer: function(id) {
            // Usuwa ze struktury
            G.Config.game_config_page.find(".game_config_page_player[data-id='" + id + "']").remove();
            
            // Poprzez usunięcie uległa przesunięciu indeksacja tablicy graczy aktualizuje to w strukturze
            $.each(G.Config.players_names, function(player_id) {
                if (player_id < id) {
                    return;
                }
                
                G.Config.game_config_page.find("[data-id='" + (player_id + 1) + "']").attr("data-id", player_id);
            });
        },
        
        // Dodaje gracza
        addPlayer: function() {
            var id                      = G.Config.players-1,
                name                    = G.Config.players_names[id],
                color                   = G.Config.players_colors[id],
                player                  = $("<div/>").addClass("game_config_page_player"),
                player_button           = $("<a/>").attr("href", "#").addClass("game_config_page_player_button"),
                player_name             = $("<div/>").addClass("game_config_page_player_name"),
                player_color            = $("<div/>").addClass("game_config_page_player_color");
        
            G.Config.game_config_page.find("#game_config_page_new_player")
                                     .before(player.clone().attr("data-id", id)
                                                   .append(player_button.clone().attr("data-id", id).addClass("game_config_page_player_edit_button"))
                                                   .append(player_button.clone().attr("data-id", id).addClass("game_config_page_player_delete_button"))
                                                   .append(player_name.clone().attr("data-id", id).text(name))
                                                   .append(player_color.clone().attr("data-id", id).addClass("jscolor {value: '" + G.Config.players_colors[id] + "', onFineChange:'Game.Controller.editPlayerColor(" + id + ", this.toHEXString())'}").css("background-color", color)));
        }
    };
})(Game);