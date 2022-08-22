import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PiplupPixel from "../../assets/images/piplup-pixel.png";
import "./pokedex-item.css";

import PokemonLoader from "../utils/pokemon-loader";

export default function PokedexItem({ pokemon }) {
  return (
    <>
      <div className={"pokemon-image-container"}>
        {pokemon.selected ? <PokemonLoader /> : null}
        <img
          className={"image pokemon-image"}
          src={pokemon.sprite}
          alt={"pokemon-image"}
        />
      </div>
      <div className={"sub-container pokemon-info-container"}>
        <h6 className={"subtitle pokemon-pokedex-number"}>
          {pokemon.pokedexNumber}
        </h6>
        <h4 className={"title pokemon-name"}>{pokemon.name}</h4>
      </div>
    </>
  );
}
