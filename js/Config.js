// Objekt Konfiguracyjny
(function(G) {
    G.Config = {
        game_state      : 0,
        game_board      : null,
        game_rows       : 7,
        game_columns    : 14,
        win_at          : 4,
        player          : 0,
        start_player    : 0,
        last_move       : null,
        players         : 2,
        players_names   : ["Gracz1", "Gracz2"],
        players_colors  : ["#06b868", "#c4ff00"],
        game_container  : null,
        game_start_page : null,
        game_config_page: null,
        game_page       : null,
        game_end_page   : null,
        win_chain       : null
    };
})(Game);