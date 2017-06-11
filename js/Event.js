// Objekt zdarzeń
(function(G) {
    G.Event = {
        // Inicjuje podstawowe eventy
        init: function() {
            // Dodaje zdarzenie do zmieniania rozmiarów strony
            G.Event.bindPageResize();
            
            // Dodaje zdarzenie do zapisania danych gry przed zamknięciem gry
            $(window).on("unload", G.Controller.close);
        },
        
        // Dodaje zdarzenie dla zmiany rozmiaru strony w celu wyskalowanie planszy gry
        bindPageResize: function() {
            $(window).on("resize", G.View.adjustFieldsSize);
        },
        
        // Dodaje zdarzenia do strony startowej
        bindStartPage: function() {
            // Dodaje zdarzenia do guzików na stronie startowej
            G.Config.game_start_page.find("#game_start_page_start_button").on("click", G.Controller.start);
            G.Config.game_start_page.find("#game_start_page_config_button").on("click", G.Controller.config);
        },
        
        // Dodaje zdarzenia do strony gry
        bindGameStructure: function() {
            // Dodaje zdarzenia do kolumn
            G.Config.game_page.find(".game_column").on("click", G.Controller.tryMove);
            
            // Dodaje zdarzenie do guzika wyjścia
            G.Config.game_page.find("#game_page_exit_button").on("click", G.Controller.exit);
        },
        
        // Dodaje zdarzenia do strony konfiguracyjnej
        bindConfigPage: function() {
            // Dodaje zdarzenia do sekcji graczy
            // Dodaje zdarzenie do guzika zmiany nazwy gracza
            G.Config.game_config_page.find(".game_config_page_player_edit_button").on("click", G.Controller.startEditPlayerName);
            
            // Zmiana koloru gracza
            G.Config.game_config_page.find(".game_config_page_player_color").ColorPicker({
                onBeforeShow: function () {
                    $(this).ColorPickerSetColor(G.Config.players_colors[$(this).attr("data-id")]);
                },
                
                onChange: G.Controller.editPlayerColor,
                
                onSubmit: function(hsb, hex, rgb, el) {
                    $(el).ColorPickerHide();
                }
            });
            
            // Usuwanie gracza
            G.Config.game_config_page.find(".game_config_page_player_delete_button").on("click", G.Controller.deletePlayer);
            
            // Dodawanie nowego gracza
            G.Config.game_config_page.find("#game_config_page_new_player").on("click", G.Controller.addPlayer);
            
            // Dodaje zdarzenia do pól opcji liczbowych
            G.Config.game_config_page.find(".game_config_page_amount").on("input", G.Controller.changeOptionAmount);
            
            // Dodaje zdarzenie do guzika powrotu do strony startowej
            G.Config.game_config_page.find("#game_config_page_back_button").on("click", G.Controller.exit);
        },
        
        // Dodaje zdarzenie do nowego gracza
        bindNewPlayer: function() {
            // Dodaje zdarzenie do guzika zmiany nazwy gracza
            G.Config.game_config_page.find(".game_config_page_player_edit_button[data-id='" + (G.Config.players-1) + "']").on("click", G.Controller.startEditPlayerName);
            
            // Zmiana koloru gracza
            G.Config.game_config_page.find(".game_config_page_player_color").ColorPicker({
                onBeforeShow: function () {
                    $(this).ColorPickerSetColor(G.Config.players_colors[$(this).attr("data-id")]);
                },
                
                onChange: G.Controller.editPlayerColor,
                
                onSubmit: function(hsb, hex, rgb, el) {
                    $(el).ColorPickerHide();
                }
            });
            
            // Usuwanie gracza
            G.Config.game_config_page.find(".game_config_page_player_delete_button[data-id='" + (G.Config.players-1) + "']").on("click", G.Controller.deletePlayer);
        },
        
        // Dodaje zdarzenie do pola edycji nazwy gracza
        bindStartEditPlayerName: function(id) {
            G.Config.game_config_page.find(".game_config_page_edit_player_input[data-id='" + id + "']").on("keyup blur", G.Controller.editPlayerName);
        },
        
        // Dodaje zdarzenie do strony końcowej
        bindEndPage: function() {
            // Dodaje zdarzenia do guzików na stronie końcowej
            G.Config.game_end_page.find("#game_end_page_again_button").on("click", G.Controller.restart);
            
            // Dodaje zdarzenie do guzika wyjścia
            G.Config.game_end_page.find("#game_end_page_exit_button").on("click", G.Controller.exit);
        }
    };
})(Game);