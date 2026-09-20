"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const linearLoop = { duration: 28, ease: "linear" as const, repeat: Infinity };

export function HeroRocks() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-rocks" aria-hidden="true">
      <div className="hero-rocks-grid" />
      <div className="hero-rocks-ring hero-rocks-ring-outer" />
      <div className="hero-rocks-ring hero-rocks-ring-inner" />

      <motion.div
        className="hero-main-rock"
        animate={reduceMotion ? undefined : { rotate: 360, y: [0, -7, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                rotate: linearLoop,
                y: { duration: 6, ease: "easeInOut", repeat: Infinity },
              }
        }>
        <Image
          src="/hero-rocks/main-rock.png"
          alt=""
          width={1248}
          height={1248}
          priority
          sizes="(max-width: 760px) 70vw, 38vw"
        />
      </motion.div>

      <motion.div
        className="hero-rock-orbit hero-rock-orbit-one"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : linearLoop}>
        <motion.div
          className="hero-orbit-rock hero-orbit-rock-one"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={reduceMotion ? undefined : linearLoop}>
          <Image
            src="/hero-rocks/orbit-rock-angular.png"
            alt=""
            width={1248}
            height={1248}
            sizes="(max-width: 760px) 19vw, 9vw"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-rock-orbit hero-rock-orbit-two"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 19, ease: "linear", repeat: Infinity }
        }>
        <motion.div
          className="hero-orbit-rock hero-orbit-rock-two"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 19, ease: "linear", repeat: Infinity }
          }>
          <Image
            src="/hero-rocks/orbit-rock-layered.png"
            alt=""
            width={1248}
            height={1248}
            sizes="(max-width: 760px) 15vw, 7vw"
          />
        </motion.div>
      </motion.div>

      <div className="hero-rocks-index">
        <span>31.63° N</span>
        <span>08.00° W</span>
      </div>
    </div>
  );
}
