Feature: Game Match

Rule: A match will decide a winner based on the option player and npc picked
 Scenario Outline: player pick a different option than npc
    Given I pick "<my_pick>"
    And NPC (server) pick "<npc_pick>"
    And The game complete with player as a "<result>" 
    When The match is on
    Then The winner should be "<result>"
    Examples:
    | my_pick | npc_pick | result |
    | rock    | paper    | lose   |
    | rock    | scissor  | win    |
