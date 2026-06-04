"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import parse from "html-react-parser";

interface JournalEntry {
  dayNumber: number;
  date: string;
  content: string;
}