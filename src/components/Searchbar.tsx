"use client";

import { scrapeAndStore } from "@/lib/actions";
import React, { ChangeEvent, FormEvent, useState } from "react";

const isValidAmazonUrl = (url: string): boolean => {
  try {
    //On parse l'URL et on récupère l'hostname
    const { hostname } = new URL(url);

    //on vérifie l'hostname
    if (hostname.includes("amazon.") || hostname.endsWith("amazon")) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //SUBMIT DU FORMULAIRE
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = isValidAmazonUrl(searchPrompt);

    if (!isValid) return alert("INVALID LINK");

    try {
      setIsLoading(true);
      const product = await scrapeAndStore(searchPrompt);
      console.log('product : ', product);
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  };

  //ONCHANGE DU INPUT
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="flex flew-wrap gap-4 mt-12"
    >
      <input
        type="text"
        name="link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={handleChange}
        placeholder="Enter product link."
      />
      <button
        disabled={isLoading || searchPrompt === ""}
        type="submit"
        className="searchbar-btn"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
