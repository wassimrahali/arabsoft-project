import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import jsonData from "./data.json";
import "./productDetails.css"; // Make sure to have your styles file imported
import RH from "../../assets/images/img5.png";
import Footer from "../../Components/Footer";
import Dashboard from "../Dashboard/Header";

const HRManagementDetails = () => {
  return (
    <>
      <Dashboard />
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn d-flex align-items-center" data-wow-delay="0.1s">
              <img className="img-fluid animated pulse infinite" src={RH} alt="Product" />
            </div>

            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <div className="text-container">
                <h1 className="custom-heading">
                  AMIN{" "}
                  <span style={{fontSize:'30px'}} className="custom-light-text">
                    GESTION FINANCIÈRE ET COMPTABLE
                  </span>
                </h1>
                <p className="custom-paragraph mb-4">
                  Amin est un progiciel de gestion financière et comptable composé
                  de onze modules intégrés qui s’articulent sur un référentiel
                  commun.{" "}
                </p>
                <p className="custom-paragraph mb-4">
                  Amin s’interface avec tous les progiciels d’Arab Soft via un
                  système d’échange paramétrable permettant une intégration
                  dynamique en temps réel ou en différé.
                </p>
                <a className="custom-btn" href="/submit">
                 Order Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="site-section">
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-lg-0 mb-4">
        <div class="box-with-humber bg-white p-5">
          <span class="icon icon-format_paint mr-2 text-primary h3 mb-3 d-block"></span>
          <p class="custom-paragraph mb-4">
            <h2 class="custom-h2">La gestion de la trésorerie</h2>
            Intégration avec la gestion des encaissements, des
            décaissements, des emprunts et des placements
          </p>
          <ul class="list-unstyled ul-check primary">
            <li class="custom-list-item">Mise à jour des comptes de trésorerie</li>
            <li class="custom-list-item">Gestion des prévisions, de réalisations et des écarts</li>
            <li class="custom-list-item">Rapports de suivi de la situation prévisionnelle de trésorerie</li>
          </ul>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-lg-0 mb-4" data-jarallax-element="-50">
        <div class="box-with-humber bg-white p-5">
          <span class="icon icon-palette mr-2 text-primary h3 mb-3 d-block"></span>
          <h2 class="custom-h2">Rapprochement Bancaire</h2>
          <p class=" custom-paragraph mb-4">
            Gestion des critères de rapprochement spécifiques à chaque banque
          </p>
          <ul class="list-unstyled ul-check primary">
            <li class="custom-list-item">Intégration automatique des relevés des comptes</li>
            <li class="custom-list-item"> Branding</li>
            <li class="custom-list-item">Édition états de rapprochement</li>
          </ul>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-lg-0 mb-4" data-jarallax-element="20">
        <div class="box-with-humber bg-white p-5">
          <span class="icon icon-laptop2 mr-2 text-primary h3 mb-3 d-block">
            
          </span>
          <h2 class="custom-h2">Opérations Bancaires</h2>
          <p class=" custom-paragraph mb-4">
          Suivi des conditions prévues par les conventions avec les banques
          </p>
          <ul class="list-unstyled ul-check primary">
            <li class="custom-list-item">Echelles d’intérêts</li>
            <li class="custom-list-item">Commissions bancaires</li>
            <li class="custom-list-item">Contrôle du découvert</li>
            <li class="custom-list-item">Consolidation des comptes</li>
            <li class="custom-list-item">Analyse des écarts </li>
            <li class="custom-list-item"> ​​Mise à jour des clés de répartition variables ou fixes</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
      <Footer />
    </>
  );
};

export default HRManagementDetails;
