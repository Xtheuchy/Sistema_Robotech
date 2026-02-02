package com.Robotech.BackEnd_Robotech.util;

import org.apache.commons.text.similarity.JaroWinklerDistance;

public class SimilarityUtil {
    private static final double SIMILARITY_THRESHOLD = 0.98;

    /**
     * Valida si dos cadenas son suficientemente similares utilizando el algoritmo Jaro-Winkler.
     *
     * @param str1 Primera cadena a comparar.
     * @param str2 Segunda cadena a comparar.
     * @return true si las cadenas son similares según el umbral, false si no lo son.
     */
    public static boolean validarSimilitud(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return false;
        }

        JaroWinklerDistance jaroWinkler = new JaroWinklerDistance();
        double similitud = jaroWinkler.apply(str1, str2);

        return similitud >= SIMILARITY_THRESHOLD;
    }
}
