import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import PiplupPixel from "../../assets/images/piplup-pixel.png";
import "./index.css";

import PokedexItem from "../../components/pokedex/pokedex-item";

export default function Pokedex() {
  const [pokedex, setPokedex] = useState([
    {
      id: 1,
      sprite: PiplupPixel,
      pokedexNumber: "001",
      name: "Piplup",
      selected: true,
    },
    {
      id: 2,
      sprite: PiplupPixel,
      pokedexNumber: "002",
      name: "Prinplup",
      selected: false,
    },
    {
      id: 3,
      sprite: PiplupPixel,
      pokedexNumber: "003",
      name: "Empoleon",
      selected: false,
    },
    {
      id: 4,
      sprite: PiplupPixel,
      pokedexNumber: "004",
      name: "Chinchar",
      selected: false,
    },
    {
      id: 5,
      sprite: PiplupPixel,
      pokedexNumber: "005",
      name: "Monferno",
      selected: false,
    },
    {
      id: 6,
      sprite: PiplupPixel,
      pokedexNumber: "006",
      name: "Infernape",
      selected: false,
    },
    {
      id: 7,
      sprite: PiplupPixel,
      pokedexNumber: "007",
      name: "Turtwig",
      selected: false,
    },
    {
      id: 8,
      sprite: PiplupPixel,
      pokedexNumber: "008",
      name: "Grotle",
      selected: false,
    },
    {
      id: 9,
      sprite: PiplupPixel,
      pokedexNumber: "009",
      name: "Torterra",
      selected: false,
    },
  ]);
  const [pokedexRange, setPokedexRange] = useState([]);

  // change this variable to show more/less pokemons
  // in the pokedex
  const [numberOfPokemonToBeDisplayed, setNumberOfPokemonToBeDisplayed] =
    useState(7);

  function addPokemonIntoPokedexRange(array, index) {
    const tempPokedexRange = [];

    const numberOfPreviousPokemon = Math.floor(
      numberOfPokemonToBeDisplayed / 2
    ); // 2

    for (let counter = 0; counter < numberOfPokemonToBeDisplayed; counter++) {
      let tempIndex = index - numberOfPreviousPokemon + counter;

      const pokemon = array[index - numberOfPreviousPokemon + counter];

      if (pokemon) {
        tempPokedexRange.push(pokemon);
      } else {
        tempPokedexRange.push({ id: tempIndex + 1, temporary: true });
      }
    }

    return tempPokedexRange;
  }

  function setPokedexRangeFromSelected() {
    let tempPokedexRange = [];

    pokedex.map((pokemon, index, array) => {
      // get the previous pokemons and after pokemons from the
      // selected pokemon
      // for example in terms of numerals: [1, 2, 3, 4, 5, 6]
      // if 3 is selected, get [1, 2, 3, 4, 5]
      if (pokemon.selected) {
        tempPokedexRange = addPokemonIntoPokedexRange(array, index);
      }
    });

    setPokedexRange(tempPokedexRange);
  }

  // runs every time a new pokemon is selected
  useEffect(() => {
    setPokedexRangeFromSelected();
  }, [pokedex]);

  function selectPokemon(pokemonId) {
    const newPokedex = pokedex.map((pokemon) =>
      pokemon.id === pokemonId
        ? { ...pokemon, selected: true }
        : { ...pokemon, selected: false }
    );
    setPokedex(newPokedex);
  }

  function exceedMaxPokemonToBeDisplayed(middle, increment) {
    if (middle + increment > numberOfPokemonToBeDisplayed) {
      return true;
    }

    return false;
  }

  function findAnimateIndex() {
    let middle = Math.floor(numberOfPokemonToBeDisplayed / 2);
    let innerSides = !exceedMaxPokemonToBeDisplayed(middle, 1) && [
      middle - 1,
      middle + 1,
    ];
    let outerSides = !exceedMaxPokemonToBeDisplayed(middle, 2) && [
      middle - 2,
      middle + 2,
    ];

    return { middle, innerSides, outerSides };
  }

  function getAnimateValue(index, values) {
    const { middle, innerSides, outerSides } = findAnimateIndex();
    const { middleValue, innerSideValue, outerSideValue, defaultValue } =
      values;

    let scaleValues = {};

    if (middle) {
      scaleValues[middle] = middleValue;
    }

    if (innerSides) {
      innerSides.forEach(
        (innerSide) => (scaleValues[innerSide] = innerSideValue)
      );
    }

    if (outerSides) {
      outerSides.forEach(
        (outerSide) => (scaleValues[outerSide] = outerSideValue)
      );
    }

    return scaleValues[index] ?? defaultValue;
  }

  const animateScaleValues = {
    middleValue: 1.2,
    innerSideValue: 1,
    outerSideValue: 0.8,
    defaultValue: 0.8,
  };

  const animateOpacityValues = {
    middleValue: 1,
    innerSideValue: 0.6,
    outerSideValue: 0.4,
    defaultValue: 0,
  };

  return (
    <div
      className={"pokedex d-flex flex-column"}
      style={{ gap: ".6rem", width: "30%" }}
    >
      {/* can't refactor the children even further
          because the animation won't run
      */}
      {pokedexRange.map((pokemon, index) => {
        // -------------- Without Pokemon -----------------
        if (pokemon?.temporary) {
          return (
            <motion.div
              key={pokemon.id}
              layout
              className={`empty-pokedex-pokemon-container`}
            ></motion.div>
          );
        }

        // -------------- With Pokemon -----------------
        return (
          <motion.div
            key={pokemon.id}
            // issue: animate kept making transform-origin to center
            // solution: change the style 'origin' directly instead
            // reference: https://github.com/framer/motion/issues/255
            style={{ originX: 1, originY: 0.5 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: getAnimateValue(index, animateScaleValues),
              opacity: getAnimateValue(index, animateOpacityValues),
              transition: { duration: 0.5 },
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            layout
            className={`container pokedex-pokemon-container 
                ${pokemon.selected && "selected"}
              `}
            onClick={() => selectPokemon(pokemon.id)}
          >
            <PokedexItem pokemon={pokemon} />
          </motion.div>
        );
      })}
    </div>
  );
}
