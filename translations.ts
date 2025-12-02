
import { Language } from './types';

export const TRANSLATIONS = {
  en: {
    appTitle: "Interactive Production Line Simulator",
    appSubtitle: "Observe Little's Law: L = λW (Avg. WIP = Throughput × Avg. Lead Time)",
    settings: "Settings",
    footer: "Adjust parameters for each step to see how bottlenecks, blocking, and queue sizes impact overall system performance.",
    
    metrics: {
      wip: "Avg. Work in Progress (L)",
      throughput: "Avg. Throughput (λ)",
      leadTime: "Avg. Lead Time (W)",
      lastAvg: "Last {0} avg",
    },
    
    units: {
      itemsMin: "items/min",
      itemsHr: "items/hr",
      itemsDay: "items/day",
      minutes: "Minutes",
      hours: "Hours",
      days: "Days",
      sec: "sec",
      min: "min",
      hr: "hr",
      secItem: "s/item",
      minItem: "m/item",
      hrItem: "h/item",
      items: "items"
    },

    controls: {
      reset: "Reset All",
      speed: "Speed",
      copy: "Copy",
      copyTooltip: "Copy Cycle and Setup Times to all other steps",
      addStep: "Add Step",
      removeStep: "Remove Step",
      steps: "Steps"
    },

    stepParams: {
      batchSize: "Batch Size",
      setupTime: "Setup Time",
      cycleTime: "Cycle Time"
    },

    tabs: {
      simulation: "Simulation",
      analytics: "Analytics"
    },

    status: {
      idle: "Idle",
      setup: "Setup",
      producing: "Producing",
      blocked: "Blocked"
    },

    charts: {
      time: "Time",
      wip: "WIP (items)",
      waiting: "Waiting for simulation data..."
    },
    
    settingsModal: {
      title: "Settings",
      done: "Done",
      timeUnitLabel: "Simulation Time Unit",
      timeUnitDesc: "Controls how time is measured and displayed. Changing this recalculates metrics based on the new unit.",
      languageLabel: "Language / Taal",
      languageDesc: "Switch between English and Dutch.",
      warningTitle: "Warning",
      resetWarning: "Changing the time unit will RESET the simulation. Do you want to continue?",
      confirmReset: "Yes, Change & Reset",
      cancel: "Cancel",
      
      // Scenario Section
      scenarioLabel: "Scenario Code",
      scenarioDesc: "Save your settings or load a predefined scenario.",
      copyCode: "Copy Code",
      loadCode: "Load Scenario",
      placeholderCode: "Paste code here...",
      invalidCode: "Invalid Code",
      codeCopied: "Copied!"
    },

    resetConfirmation: {
      title: "Reset Simulation",
      message: "Are you sure you want to reset the simulation? All current data will be lost.",
      confirm: "Yes, Reset",
      cancel: "Cancel"
    },

    helpModal: {
        title: "How it Works",
        goalTitle: "Goal of the Simulation",
        goalDesc: "This simulation demonstrates the dynamics of a production line. By experimenting with times and batch sizes, you learn how **Bottlenecks**, **Blocking**, and **Variability** affect the performance (Throughput and Lead Time) according to Little's Law.",
        
        section1Title: "1. Configure Steps",
        section1Desc: "Use the sliders below each machine to adjust the process:",
        paramBatch: "**Batch Size:** How many items are processed together.",
        paramSetup: "**Setup Time:** Time required before a batch starts (e.g., changing tools). Represents lost capacity.",
        paramCycle: "**Cycle Time:** Time to process ONE item. Total batch time = Setup + (Batch × Cycle).",

        section2Title: "2. Machine Statuses",
        section2Desc: "The colored rings indicate what a machine is doing:",
        statusIdle: "**Idle (Gray):** Waiting for input material.",
        statusSetup: "**Setup (Orange):** Preparing for a new batch. No output yet.",
        statusProd: "**Producing (Blue):** Processing items.",
        statusBlock: "**Blocked (Red):** Finished, but cannot pass the batch because the next queue is full.",

        section3Title: "3. Analyze Metrics",
        section3Desc: "Monitor the key performance indicators (KPIs) at the top:",
        metricWip: "**Work In Progress (L):** Total items in the system.",
        metricTh: "**Throughput (λ):** Rate of finished products leaving the system.",
        metricLt: "**Lead Time (W):** Total time a batch spends in the system (processing + waiting).",

        section4Title: "4. Tabs: Simulation vs Analytics",
        section4Desc: "Switch between views using the tabs at the top:",
        tabSim: "**Simulation:** Live view of the machines and queues.",
        tabAnalytics: "**Analytics:** Interactive graph showing trends of WIP, Throughput, and Lead Time over time.",

        section5Title: "5. Scenarios (Save/Load)",
        section5Desc: "Use **Scenario Codes** to save your setup or load a preset assignment:",
        scenarioStep1: "Go to **Settings** to see your unique code.",
        scenarioStep2: "**Copy** the code to share it with others.",
        scenarioStep3: "**Paste** a code and click Load to restore a specific configuration instantly."
    },
    
    littlesLaw: {
        title: "Little's Law Explained",
        subtitle: "Dynamics of Production Systems",
        formula: "L = λ × W",
        analogyTitle: "The Factory Floor",
        analogyIntro: "In a stable production environment, three fundamental variables are mathematically linked:",
        
        lTitle: "L (WIP)",
        lSubtitle: "Work In Progress",
        lDesc: "The total inventory currently in the system. This includes raw materials, parts in machines, and items waiting in queues.",
        
        thTitle: "λ (Throughput)",
        thSubtitle: "Production Rate",
        thDesc: "The average number of finished products leaving the factory per unit of time (e.g., items per hour).",
        
        wTitle: "W (Lead Time)",
        wSubtitle: "Throughput Time",
        wDesc: "The average time it takes for a single unit to travel through the entire process, from start to finish.",
        
        conclusionTitle: "The Core Insight",
        conclusionText: "To reduce Lead Time (W) without increasing machine speed (λ), you MUST reduce the Work In Progress (L). Pushing more orders into a full system only increases waiting times.",
        math: "Lead Time = Inventory / Throughput"
    },

    stepPrefix: "Step",
    stepNameMapping: {
        "Zagen": "Sawing",
        "Buigen": "Bending",
        "Lassen": "Welding",
        "Assembleren": "Assembly"
    }
  },
  nl: {
    appTitle: "Interactieve Productielijn Simulator",
    appSubtitle: "Bekijk de Wet van Little: L = λW (Gem. OHW = Output × Gem. Doorlooptijd)",
    settings: "Instellingen",
    footer: "Pas de parameters per stap aan om te zien hoe knelpunten, blokkades en wachtrijen de prestaties van het systeem beïnvloeden.",

    metrics: {
      wip: "Gem. Onderhanden Werk (L)",
      throughput: "Gem. Output (λ)",
      leadTime: "Gem. Doorlooptijd (W)",
      lastAvg: "Gem. laatste {0}",
    },

    units: {
      itemsMin: "stuks/min",
      itemsHr: "stuks/uur",
      itemsDay: "stuks/dag",
      minutes: "Minuten",
      hours: "Uren",
      days: "Dagen",
      sec: "sec",
      min: "min",
      hr: "uur",
      secItem: "s/stuk",
      minItem: "m/stuk",
      hrItem: "u/stuk",
      items: "stuks"
    },

    controls: {
      reset: "Reset Alles",
      speed: "Snelheid",
      copy: "Kopieer",
      copyTooltip: "Kopieer Cyclus- en Insteltijden naar alle andere stappen",
      addStep: "Stap toevoegen",
      removeStep: "Stap verwijderen",
      steps: "Stappen"
    },

    stepParams: {
      batchSize: "Batchgrootte",
      setupTime: "Insteltijd",
      cycleTime: "Cyclustijd"
    },

    tabs: {
      simulation: "Simulatie",
      analytics: "Analyse"
    },

    status: {
      idle: "Wacht",
      setup: "Omstellen",
      producing: "Produceren",
      blocked: "Geblokkeerd"
    },

    charts: {
      time: "Tijd",
      wip: "OHW (stuks)",
      waiting: "Wachten op simulatie data..."
    },

    settingsModal: {
      title: "Instellingen",
      done: "Klaar",
      timeUnitLabel: "Simulatie Tijdseenheid",
      timeUnitDesc: "Bepaalt hoe tijd wordt gemeten en weergegeven. Dit herberekent de statistieken op basis van de nieuwe eenheid.",
      languageLabel: "Taal / Language",
      languageDesc: "Wissel tussen Engels en Nederlands.",
      warningTitle: "Waarschuwing",
      resetWarning: "Het wijzigen van de tijdseenheid zal de simulatie RESETTEN. Wil je doorgaan?",
      confirmReset: "Ja, Wijzig & Reset",
      cancel: "Annuleren",
      
      // Scenario Section
      scenarioLabel: "Scenario Code",
      scenarioDesc: "Sla je instellingen op of laad een vooraf gemaakt scenario.",
      copyCode: "Kopieer Code",
      loadCode: "Laad Scenario",
      placeholderCode: "Plak code hier...",
      invalidCode: "Ongeldige Code",
      codeCopied: "Gekopieerd!"
    },

    resetConfirmation: {
      title: "Simulatie Resetten",
      message: "Weet je zeker dat je de simulatie wilt resetten? Alle huidige data gaat verloren.",
      confirm: "Ja, Reset",
      cancel: "Annuleren"
    },

    helpModal: {
        title: "Instructie",
        goalTitle: "Doel van de Simulatie",
        goalDesc: "Deze simulatie toont de dynamiek van een productielijn. Door te experimenteren met tijden en batchgroottes leer je hoe **Knelpunten (Bottlenecks)**, **Blokkades** en **Variabiliteit** de prestaties (Output en Doorlooptijd) beïnvloeden volgens de Wet van Little.",
        
        section1Title: "1. Configureer Stappen",
        section1Desc: "Gebruik de sliders onder elke machine om het proces aan te passen:",
        paramBatch: "**Batchgrootte:** Hoeveel producten samen worden verwerkt.",
        paramSetup: "**Insteltijd:** Tijd nodig vóór een batch start (bijv. ombouwen). Dit is verloren capaciteit.",
        paramCycle: "**Cyclustijd:** Tijd om ÉÉN product te maken. Totale batchtijd = Insteltijd + (Batch × Cyclustijd).",

        section2Title: "2. Machine Statussen",
        section2Desc: "De gekleurde ringen geven aan wat een machine doet:",
        statusIdle: "**Wachten (Grijs):** Wacht op materiaal.",
        statusSetup: "**Omstellen (Oranje):** Voorbereiden op een batch. Nog geen output.",
        statusProd: "**Produceren (Blauw):** Producten aan het verwerken.",
        statusBlock: "**Geblokkeerd (Rood):** Klaar, maar kan de batch niet doorgeven omdat de volgende wachtrij vol is.",

        section3Title: "3. Analyseer Metrieken",
        section3Desc: "Houd de prestatie-indicatoren (KPI's) bovenin in de gaten:",
        metricWip: "**Onderhanden Werk (L):** Totaal aantal items in het systeem.",
        metricTh: "**Output (λ):** Snelheid waarmee gereed product het systeem verlaat.",
        metricLt: "**Doorlooptijd (W):** Totale tijd die een batch in het systeem doorbrengt (bewerken + wachten).",

        section4Title: "4. Tabbladen: Simulatie vs Analyse",
        section4Desc: "Wissel tussen weergaven met de tabbladen bovenaan:",
        tabSim: "**Simulatie:** Live weergave van de machines en wachtrijen.",
        tabAnalytics: "**Analyse:** Interactieve grafiek die het verloop van OHW, Output en Doorlooptijd in de tijd toont.",

        section5Title: "5. Scenario's Opslaan & Delen",
        section5Desc: "Gebruik **Scenario Codes** om je instellingen op te slaan of een opdracht in te laden:",
        scenarioStep1: "Ga naar **Instellingen** om je unieke code te zien.",
        scenarioStep2: "**Kopieer** de code om deze met anderen te delen.",
        scenarioStep3: "**Plak** een code en klik op Laad Scenario om een specifieke configuratie direct te herstellen."
    },

    littlesLaw: {
        title: "Uitleg Wet van Little",
        subtitle: "Dynamica van Productiesystemen",
        formula: "L = λ × W",
        analogyTitle: "De Productievloer",
        analogyIntro: "In een stabiel productiesysteem zijn drie basisvariabelen wiskundig aan elkaar gekoppeld:",
        
        lTitle: "L (OHW)",
        lSubtitle: "Onderhanden Werk (WIP)",
        lDesc: "De totale voorraad die zich momenteel in het systeem bevindt. Dit omvat ruw materiaal, producten in machines én producten in de wachtrijen.",
        
        thTitle: "λ (Output)",
        thSubtitle: "Productiesnelheid (Throughput)",
        thDesc: "Het gemiddelde aantal gereed product dat de fabriek per tijdseenheid verlaat (bijv. stuks per uur).",
        
        wTitle: "W (Doorlooptijd)",
        wSubtitle: "Doorlooptijd (Lead Time)",
        wDesc: "De gemiddelde tijd die één product nodig heeft om het volledige proces te doorlopen, van start tot finish.",
        
        conclusionTitle: "Het Inzicht",
        conclusionText: "Om de Doorlooptijd (W) te verkorten zonder dat machines sneller gaan werken (λ), MOET je het Onderhanden Werk (L) verlagen. Meer orders in een vol systeem duwen zorgt enkel voor langere wachttijden.",
        math: "Doorlooptijd = Voorraad / Output"
    },

    stepPrefix: "Stap",
    stepNameMapping: {
        "Sawing": "Zagen",
        "Bending": "Buigen",
        "Welding": "Lassen",
        "Assembly": "Assembleren"
    }
  }
};
