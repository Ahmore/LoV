// Objekt kontrolujący grę
(function(G) {
    G.Controller = {
        
        /*
         *      Inicjacja gry i jej głównych funkcji
         */
        
        // Inicjacja, wygenerowanie i wyświetlenie strony startowej
        init: function() {
            // Zatytułowanie strony nazwą gry
            $(document).attr("title", G.Info.name);
                
            // Zapamiętanie wskaźnika na kontener gry
            G.Config.game_container = $("body");
            
            // Jeśli istnieje w pamięci konfiguracja gry z poprzedniej sesji wczytuje ją
            if (localStorage.Config) {
                G.Config = $.extend(G.Config, JSON.parse(localStorage.Config));
            }
            
            // Inicjacja podstawowych eventów
            G.Event.init();

            // Generuje stronę startową
            G.View.generateStartPage();
            G.Event.bindStartPage();
            
            // Generuje stronę konfiguracyjną
            G.View.generateConfigPage();
            G.Event.bindConfigPage();
            
            // Generuje strukturę gry ale nie planszę
            G.View.generateGamePage();
            
            // Generuje stronę końca gry
            G.View.generateEndPage();
            G.Event.bindEndPage();
            
            
            // Wyświetla stronę startową
            G.View.showStartPage();
        },
        
        // Włącza grę
        on: function() {
            G.Config.game_state = 1;
        },
        
        // Wyłącza grę 
        off: function() {
            G.Config.game_state = 0;
        },
        
        // Start gry
        start: function() {
            // Konfiguracja
            G.Config.player = G.Config.start_player;
            
            // Generuje planszę gry, dodaje zdarzenia i konfiguruje
            G.Controller.generateGameBoard();
            G.View.generateGameStructure();
            G.Event.bindGameStructure();
            
            // Ukrywa stronę startową i ewentualnie końcową i pokazuje stronę gry
            G.View.hideStartPage();
            G.View.hideEndPage();
            G.View.showGamePage();
            G.View.showWhoseMove();
            
            // Dostosowuje wielkość pól do gry
            // Musi to być robione po pokazaniu strony, gdyż inaczej występuje bład w skalowaniu
            G.View.adjustFieldsSize();
            
            // Włącza grę
            G.Controller.on();
        },
        
        // Restart gry
        restart: function() {
            // Rekonfiguracja gry
            G.Config.game_board = null;
            G.Config.last_move  = null;
            G.Config.win_chain  = null;
            G.Config.start_player++;
            
            if (G.Config.start_player >= G.Config.players) {
                G.Config.start_player = 0;
            }
            
            // Włącza grę
            G.Controller.start();
        },
        
        // Koniec gry
        end: function() {
            // Uniemożliwa kontynuację gry
            G.Controller.off();
            
            // Sprawdza czy gra zakończyła się czyimś zwycięstwem czy remisem
            // Czyjeś zwycięstwo i remis rozróżniane są po tym czy zmianna G.Config.win_chain jest pusta czy nie
            // Jeśli mamy zwycięzcę
            if (G.Config.win_chain) {
                G.View.showWinChain();
                G.View.fillEndPage(1);
                setTimeout(G.View.showEndPage, 1000);
            }
            else {
                G.View.fillEndPage(0);
                G.View.showEndPage();
            }
        },
        
        // Powrót do strony startowej
        exit: function() {
            G.View.hideGamePage();
            G.View.hideEndPage();
            G.View.hideConfigPage();
            G.View.showStartPage();
        },
        
        // Konfiguracja gry
        config: function() {
            G.View.hideStartPage();
            G.View.showConfigPage();
        },
        
        // Zamknięcie gry
        close: function() {
            localStorage.setItem("Config", JSON.stringify({
                game_rows       : G.Config.game_rows,
                game_columns    : G.Config.game_columns,
                win_at          : G.Config.win_at,
                players         : G.Config.players,
                players_names   : G.Config.players_names,
                players_colors  : G.Config.players_colors
            }));
        },
        
        
        
        /*
         *      Kontrola gry
         */
        
        // Generuje tablicę gry
        generateGameBoard: function() {
            var row;
            
            G.Config.game_board = [];
            
            // Wypełnia tablicę gry wartościami -1
            for (var i = 0; i < G.Config.game_rows; i++) {
                row = [];
                
                for (var j = 0; j < G.Config.game_columns; j++) {
                    row.push(-1);
                }
                
                // Dodaje wiersz do tablicy gry
                G.Config.game_board.push(row);
            }
        },
        
        // Wykonuje ruch
        tryMove: function() {
            var n = parseInt($(this).attr("data-n"));
            
            // Sprawcza czy gra jest włączona
            if (!G.Config.game_state) {
                return;
            }
            
            // Sprawdza czy jest możliwy ruch
            if (!G.Controller.isPossible(n)) {
                alert("Ruch niemożliwy");
                return;
            }
            
            // Wykonuje ruch
            G.Controller.move();
            
            // Sprawdza czy gra została skończona oraz czy dostępne są jakieś ruchy
            if (G.Controller.isEnd() || !G.Controller.areAvailableMoves()) {
                G.Controller.end();
                return;
            }
            
            // Ruch przekazuje kolejnemu graczowi
            G.Controller.nextMove();
        },
        
        // Sprawdza czy ruch jest możliwy
        isPossible: function(n) {
            // Wyszukuje od dołu wolne pole w kolumnie
            for (var i = G.Config.game_rows-1; i >= 0; i--) {
                if (G.Controller.isFree(G.Config.game_board[i][n])) {
                    
                    // Zapisuje znalezione pole do konfiguracji
                    G.Config.last_move = {
                        row     : i,
                        column  : n 
                    };
                    
                    return true;
                }
            }
            
            return false;
        },
        
        // Sprawdza czy wybrane pole jest wolne
        isFree: function(n) {
            return (n === -1);
        },
        
        // Wykonuje ruch
        move: function() {
            // Wpisuje w pole identyfikator użytkownika wykonując ruch
            G.Config.game_board[G.Config.last_move.row][G.Config.last_move.column] = G.Config.player;
            
            // Uwizualnia ruch
            G.View.move();
        },
        
        // Sprawdza czy gra została skończona
        isEnd: function() {
            var delta           = G.Config.win_at - 1,
                max             = 2*delta + 1,
                start_points    = [
                    [G.Config.last_move.row-delta   , G.Config.last_move.column-delta],
                    [G.Config.last_move.row         , G.Config.last_move.column-delta],
                    [G.Config.last_move.row+delta   , G.Config.last_move.column-delta],
                    [G.Config.last_move.row+delta   , G.Config.last_move.column]
                ],
                move_by         = [
                    [1, 1],
                    [0, 1],
                    [-1, 1],
                    [-1, 0]
                ],
                end_after       = [max, max, max, delta+1],
                chain,
                row,
                column;
        
            // Pętla po konfiguracjach
            for (var i = 0; i < 4; i++) {
                chain = [];
                
                // Pętla wewnątrz konfiguracji
                for (var j = 0; j < end_after[i]; j++) {
                    row     = start_points[i][0] + j*move_by[i][0];
                    column  = start_points[i][1] + j*move_by[i][1];
                    
                    // Jeśli punkt jest z poza planszy to go nie sprawdza
                    if (row < 0 || row >= G.Config.game_rows || column < 0 || column >= G.Config.game_column) {
                        continue;
                    }
                    
                    // Jeśli id pola jest różne od id aktualnego gracza czyści łańcuch i idzie dalej
                    if (G.Config.game_board[row][column] !== G.Config.player) {
                        chain = [];
                        continue;
                    }
                    
                    // Dodaje wspolrzedne dobrego pola do lancucha
                    chain.push({
                        row     : row,
                        column  : column
                    });
                    
                    // Jeżeli łańncuch ma długość zwycięską to funkcja zwraca true
                    if (chain.length === G.Config.win_at) {
                        G.Config.win_chain = chain;
                        return true;
                    }
                }
            }
            
            return false;
        },
        
        // Sprawdza czy są dostępne jakieś ruchy
        areAvailableMoves: function() {
            for (var i = 0; i < G.Config.game_rows; i++) {
                for (var j = 0; j < G.Config.game_columns; j++) {
                    if (G.Config.game_board[i][j] === -1) {
                        return true;
                    }
                }
            }
            
            return false;
        },
        
        // Ruch przekazuje następnemu graczowi
        nextMove: function() {
            // Zwiększa id aktualnego gracza
            G.Config.player++;
            
            // Jeżeli gracz o tym id nie istnieje to ruch przekazuje pierwszemu graczowi o id = 0
            if (G.Config.player >= G.Config.players) {
                G.Config.player = 0;
            }
            
            G.View.showWhoseMove();
        },
        
        
        
        /*
         *      Konfiguracja gry
         */
        
        // Umożliwia edycję nazwy gracza
        startEditPlayerName: function() {
            // Sprawdza czy nazwa gracza nie jest edytowana
            if (parseInt($(this).attr("data-edit")) === 1) {
                return false;
            }
            
            // Dodaje atrybut o trybie edycji
            $(this).attr("data-edit", 1);
            
            // uwizualnia edycję
            G.View.startEditPlayerName($(this).attr("data-id"));
            G.Event.bindStartEditPlayerName($(this).attr("data-id"));
        },
        
        // Zmienia nazwę gracza
        editPlayerName: function(e) {
            // Sprawdza czy zostało wykonanie zatwierdzenie enterem
            if (e.which !== 13 && e.type !== "blur") {
                return;
            }
            
            // Zapisuje zmiany
            G.Config.players_names[$(this).attr("data-id")] = $(this).val();
            G.View.endEditPlayerName($(this).attr("data-id"));
            
            // Usuwa atrybut o trybie edycji
            // Dodaje atrybut o trybie edycji
            $(".game_config_page_player_edit_button[data-id=" + $(this).attr("data-id") + "]").removeAttr("data-edit");
        },
        
        // Edytuje kolor gracza
        editPlayerColor: function(color) {
            // Zapamiętuje nowy kolor gracza
            G.Config.players_colors[$(this).attr("data-id")] = "#" + color;
            
            // Zmienia kolor gracza
            G.View.editPlayerColor($(this).attr("data-id"));
        },
        
        // Usuwa gracza
        deletePlayer: function() {
            if (G.Config.players === 2) {
                alert("Nie może zostać mniej niż dwoch graczy!");
                return false;
            }
            
            var id = $(this).attr("data-id");
            
            // Usuwa gracza z pamięci
            G.Config.players--;
            G.Config.players_names.splice(id, 1);
            G.Config.players_colors.splice(id, 1);
            
            // Usuwa gracza ze struktury
            G.View.deletePlayer(id);
        },
        
        // Dodaje gracza
        addPlayer: function() {
            // Dodaje gracza
            G.Config.players++;
            G.Config.players_names.push("Nowy gracz");
            G.Config.players_colors.push("#000000");
            
            // Wyświetla dodanego gracza
            G.View.addPlayer();
            G.Event.bindNewPlayer();
        },
        
        // Zmienia wartości opcji numerycznych gry
        changeOptionAmount: function() {
            var option  = $(this).attr("data-option"),
                value   = parseInt($(this).val()),
                min     = parseInt($(this).val());
            
            if (value < min || !$.isNumeric(value)) {
                G.Config[option] = min;
            }
            else {
                G.Config[option] = value;
            }
        }
    };
})(Game);