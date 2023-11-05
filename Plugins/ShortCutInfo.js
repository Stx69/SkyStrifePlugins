// Sky Strife Info Plugin
// by 9STX6
//-------------IMPORTS-------
const {
  network: { match },

  utils: { getOwningPlayer },
} = networkLayer;
// import api , utils  from  localLayer
const {
  api: { getPlayerInfo },
} = localLayer;
// import api , utils  from  headlessLayer
const {
  api: {
    combat: { getArmor },

    getCurrentStamina,
  },
} = headlessLayer;
// import api , utils  from  phaserLayer
const {
  scenes: {
    Main: { input },
  },
} = phaserLayer;

// Read lands info
function getLandsInfoArmor(entity) {
  const positionUnit = getComponentValueStrict(Position, entity);

  const selectedLTerrains = [
    ...runQuery([
      HasValue(Position, positionUnit),
      Has(TerrainType),
      Has(ArmorModifier),
      Has(MoveDifficulty),
    ]),
  ];

  const resultLand = [];

  for (const selectedLTerrain of selectedLTerrains) {
    resultLand.selectedLTerrain = selectedLTerrain;
    resultLand.Position = getComponentValueStrict(Position, selectedLTerrain);
    resultLand.ArmorModifier = getComponentValueStrict(
      ArmorModifier,
      selectedLTerrain
    );
    resultLand.TerrainType = getComponentValueStrict(
      TerrainType,
      selectedLTerrain
    );

    resultLand.MoveDifficulty = getComponentValueStrict(
      MoveDifficulty,
      selectedLTerrain
    );
  }
  return resultLand;
}
// Read unit name
function getUnitName(entity) {
  if (!hasComponent(UnitType, entity)) {
    return " Unknown";
  }
  const unitType = getComponentValueStrict(UnitType, entity).value;

  switch (unitType) {
    case 1:
      return " Soldier";
    case 2:
      return " Spearman";
    case 3:
      return " Hero";
    case 4:
      return " Light Horse";
    case 5:
      return " Knigth";
    case 7:
      return " Archer";
    default:
      return " Unknown";
  }
}
// Structure unit name
function getStructureName(entity) {
  if (!hasComponent(StructureType, entity)) {
    return " Unknown";
  }
  const structureType = getComponentValueStrict(StructureType, entity).value;

  switch (structureType) {
    case 1:
      return " Settlement";
    case 2:
      return " SpawnSettlement";
    case 9:
      return " WoodenWall";
    case 10:
      return " GoldMine";
    default:
      return " Unknown";
  }
}

// Push "I" to read information about selected entity -> utils showcase
input.onKeyPress(
  (keys) => keys.has("I"),
  () => {
    const selectedUnit = [
      ...runQuery([
        Has(Selected),
        Has(Position),
        Has(Combat),
        Has(Range),
        Has(Stamina),
        Has(UnitType),
      ]),
    ];

    const selectedStructure = [
      ...runQuery([
        Has(Selected),
        Has(Position),
        Has(StructureType),
      ]),
    ];

    if (!selectedUnit && !selectedStructure) {
      return console.log("Not selected unit or structure");
    }
    if (selectedUnit.length > 0) {
      const positionUnit = getComponentValueStrict(Position, selectedUnit);
      const resultLand = getLandsInfoArmor(selectedUnit);

      const entity = getOwningPlayer(selectedUnit);

      const _getCurrentStamina = getCurrentStamina(selectedUnit);
      const combat = getComponentValueStrict(Combat, selectedUnit);
      const staminaOnKill = getComponentValueStrict(
        StaminaOnKill,
        selectedUnit
      );

      const unitToConsole = {
        PlayerInfo: getPlayerInfo(entity),
        Entity: entity,
        getCurrentStamina: _getCurrentStamina,
        getCombatValue: combat,
        getPosition: positionUnit,
        getStaminaOnKill: staminaOnKill,
      };

      if (hasComponent(KillCount, selectedUnit)) {
        unitToConsole.getKillCount = getComponentValueStrict(
          KillCount,
          selectedUnit
        );
      }

      unitToConsole.getRange = getComponentValueStrict(Range, selectedUnit);
      unitToConsole.getStamina = getComponentValueStrict(Stamina, selectedUnit);
      unitToConsole.getUnitType = getComponentValueStrict(
        UnitType,
        selectedUnit
      );

      if (resultLand) {
        unitToConsole.TerrainEntity = resultLand.selectedLTerrain;
        unitToConsole.TerrainType = resultLand.TerrainType;
        unitToConsole.getArmorModifier = resultLand.ArmorModifier;
        unitToConsole.MoveDifficulty = resultLand.MoveDifficulty;
      }

      unitToConsole.getName = getUnitName(selectedUnit);

      console.log("Selected unit info", unitToConsole);
    }
    if (selectedStructure.length > 0) {
      if (!hasComponent(Position, selectedStructure)) {
        console.log("Structure not owned");
        return;
      }
      const position = getComponentValueStrict(Position, selectedStructure);
      const structureType = getComponentValueStrict(
        StructureType,
        selectedStructure
      );
      const entitySt = getOwningPlayer(selectedStructure);
      const structureToConsole = {
        PlayerInfo: getPlayerInfo(entitySt),
        Entity: selectedStructure,
        getPosition: position,
        getStructureType: structureType,
      };

      if (
        hasComponent(Charger, selectedStructure) &&
        hasComponent(ChargeCap, selectedStructure)
      ) {
        const charger = getComponentValueStrict(Charger, selectedStructure);
        const chargeCap = getComponentValueStrict(ChargeCap, selectedStructure);
        structureToConsole.getCharger = charger;
        structureToConsole.getChargeCap = chargeCap;
      }

      if (hasComponent(StaminaOnKill, selectedStructure)) {
        const staminaOnKillSt = getComponentValueStrict(
          StaminaOnKill,
          selectedStructure
        );
        structureToConsole.getStaminaOnKill = staminaOnKillSt;
      }

      if (hasComponent(Capturable, selectedStructure)) {
        const capturable = getComponentValueStrict(
          Capturable,
          selectedStructure
        );
        structureToConsole.getCapturable = capturable;
      }

      if (hasComponent(Combat, selectedStructure)) {
        const combatStruct = getComponentValueStrict(Combat, selectedStructure);
        structureToConsole.getCombat = combatStruct;
      }

      const structName = getStructureName(selectedStructure);
      structureToConsole.getName = structName;

      console.log("Selected structure info", structureToConsole);
    }
  }
);
