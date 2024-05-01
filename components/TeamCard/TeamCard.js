// Libs
import PropTypes from "prop-types"
import Image from "next/image"
import classnames from "classnames"

// Components
import { PageCard } from "../PageCard"
import { FlexContainer } from "../FlexContainer"
import { Hr } from "../Hr"
import { Section } from "./Section"

// CSS Module
import styles from "./TeamCard.module.css"

const TEAM_LABELS = {
    "Schizo Cats": "Cats",
    "Duck Invaders": "Ducks",
    "Donut Factory": "Pandas",
    "Raccoons of Asgard": "Racoons",
}

export function TeamCard({ teamCounter, teamDescription, teamImagePath, teamName, teamPlanetPath, teamPosition }) {
    const rootClassName = classnames(styles.container, "flexbox--space-around")

    return <PageCard className={rootClassName}>
        <FlexContainer className="full-width flexbox--space-between">
            <Section title="Blason" className={styles["team-card__logo"]}>
                <Image
                    alt={teamName}
                    src={teamImagePath}
                    layout="responsive"
                    objectFit="contain"
                    width="500px"
                    height="500px"
                    priority
                />
            </Section>
            <Section><h3>{teamName}</h3></Section>
            <Section title="Planet" className={styles["team-card__logo"]}>
                <Image
                    alt={teamName}
                    src={teamPlanetPath}
                    layout="responsive"
                    objectFit="contain"
                    width="500px"
                    height="500px"
                    priority
                />
            </Section>
        </FlexContainer>
        <Hr />
        <FlexContainer>
            <Section title="Team Description">{teamDescription}</Section>
        </FlexContainer>
        <Hr />
        <FlexContainer className="full-width flexbox--space-between">
            <Section className={classnames(styles["section--align-center"], styles["section__size"])} title={TEAM_LABELS[teamName]}>{teamCounter}</Section>
            <Section className={classnames(styles["section--align-center"], styles["section__position"])} title="Current Position">{teamPosition}</Section>
        </FlexContainer>
    </PageCard>
}

TeamCard.propTypes = {
    /**
     * Team members counter
     */
    teamCounter: PropTypes.number.isRequired,

    /**
     * Team phrase description
     */
    teamDescription: PropTypes.string.isRequired,

    /**
     * Team image path
     */
    teamImagePath: PropTypes.string.isRequired,

    /**
     * Team name
     */
    teamName: PropTypes.string.isRequired,

    /**
     * Planet image path
     */
    teamPlanetPath: PropTypes.string.isRequired,

    /**
     * Team position in season board
     */
    teamPosition: PropTypes.string.isRequired
}